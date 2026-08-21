/* global THREE */

(function () {
    "use strict";

    var CABINS = {
        "ptz-02": {
            name: "ПТЗ-02",
            capacity: "до 3 человек",
            dimensions: "1650 × 1400 × 2350 / 2700 мм",
            price: "299 000 ₽",
            width: 3.3,
            depth: 2.8,
            vents: 1,
            benches: 1
        },
        "ptz-04": {
            name: "ПТЗ-04",
            capacity: "до 6 человек",
            dimensions: "1900 × 1900 × 2350 / 2700 мм",
            price: "345 000 ₽",
            width: 3.8,
            depth: 3.8,
            vents: 1,
            benches: 2
        },
        "ptz-06": {
            name: "ПТЗ-06",
            capacity: "до 10 человек",
            dimensions: "3250 × 1900 × 2350 / 2700 мм",
            price: "470 000 ₽",
            width: 6.5,
            depth: 3.8,
            vents: 2,
            benches: 2
        }
    };
    var DEFAULT_STATE = {
        cabin: "ptz-02",
        color: "#aeb7bc",
        finish: "glass"
    };
    var state = {
        cabin: DEFAULT_STATE.cabin,
        color: DEFAULT_STATE.color,
        finish: DEFAULT_STATE.finish
    };
    var openButtons = document.querySelectorAll(".js-product-model-open");
    var modal = document.querySelector(".js-product-model-modal");

    if (!openButtons.length || !modal) {
        return;
    }

    document.body.appendChild(modal);

    var viewport = modal.querySelector(".js-product-model-viewport");
    var loading = modal.querySelector(".js-product-model-loading");
    var fallback = modal.querySelector(".js-product-model-fallback");
    var closeButton = modal.querySelector(".product-model__close");
    var closeElements = modal.querySelectorAll(".js-product-model-close");
    var title = modal.querySelector(".js-product-model-title");
    var capacity = modal.querySelector(".js-product-model-capacity");
    var dimensions = modal.querySelector(".js-product-model-dimensions");
    var price = modal.querySelector(".js-product-model-price");
    var resetButton = modal.querySelector(".js-product-model-reset");
    var previousFocus = null;
    var viewer = null;

    function setActiveOption(selector, attribute, value) {
        modal.querySelectorAll(selector).forEach(function (button) {
            var active = button.getAttribute(attribute) === value;
            button.classList.toggle("active", active);
            button.setAttribute("aria-pressed", active ? "true" : "false");
        });
    }

    function updateConfiguration() {
        var cabin = CABINS[state.cabin];

        title.textContent = cabin.name;
        capacity.textContent = cabin.capacity;
        dimensions.textContent = cabin.dimensions;
        price.textContent = cabin.price;
        setActiveOption("[data-cabin]", "data-cabin", state.cabin);
        setActiveOption("[data-frame-color]", "data-frame-color", state.color);
        setActiveOption("[data-finish]", "data-finish", state.finish);

        if (viewer) {
            viewer.setConfiguration(cabin, state.color, state.finish);
        }
    }

    function createViewer(container) {
        if (typeof THREE === "undefined") {
            throw new Error("Three.js is not loaded");
        }

        var renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true,
            powerPreference: "high-performance"
        });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        renderer.outputEncoding = THREE.sRGBEncoding;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.05;
        container.appendChild(renderer.domElement);

        var scene = new THREE.Scene();
        var camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
        var target = new THREE.Vector3(0, 2.55, 0);
        var yaw = 0.72;
        var pitch = 0.32;
        var distance = 12.2;
        var running = false;
        var frameId = null;
        var lastInteraction = Date.now();
        var pointers = {};
        var lastPointer = null;
        var pinchDistance = 0;
        var booth = null;

        scene.add(new THREE.HemisphereLight(0xf8fbff, 0x64707a, 2.1));

        var keyLight = new THREE.DirectionalLight(0xffffff, 3.1);
        keyLight.position.set(6, 10, 8);
        keyLight.castShadow = true;
        keyLight.shadow.mapSize.set(2048, 2048);
        keyLight.shadow.camera.left = -9;
        keyLight.shadow.camera.right = 9;
        keyLight.shadow.camera.top = 9;
        keyLight.shadow.camera.bottom = -5;
        scene.add(keyLight);

        var fillLight = new THREE.DirectionalLight(0x9ed8ff, 1.35);
        fillLight.position.set(-7, 5, -5);
        scene.add(fillLight);

        var rimLight = new THREE.PointLight(0x30e97d, 1.8, 18);
        rimLight.position.set(-5, 4, 6);
        scene.add(rimLight);

        var floorMaterial = new THREE.MeshStandardMaterial({
            color: 0xd8dddf,
            metalness: 0,
            roughness: 0.85
        });
        var floor = new THREE.Mesh(new THREE.CircleGeometry(8.5, 80), floorMaterial);
        floor.rotation.x = -Math.PI / 2;
        floor.position.y = -0.04;
        floor.receiveShadow = true;
        scene.add(floor);

        var frameMaterial = new THREE.MeshStandardMaterial({
            color: 0xaeb7bc,
            metalness: 0.72,
            roughness: 0.35
        });
        var darkMaterial = new THREE.MeshStandardMaterial({
            color: 0x4e5559,
            metalness: 0.55,
            roughness: 0.45
        });
        var accentMaterial = new THREE.MeshStandardMaterial({
            color: 0x25ca6a,
            emissive: 0x072d19,
            metalness: 0.2,
            roughness: 0.34
        });
        var clearGlassMaterial = new THREE.MeshPhysicalMaterial({
            color: 0xd8f3f5,
            transparent: true,
            opacity: 0.3,
            metalness: 0,
            roughness: 0.12,
            clearcoat: 1,
            clearcoatRoughness: 0.08,
            side: THREE.DoubleSide,
            depthWrite: false
        });
        var frostedGlassMaterial = new THREE.MeshPhysicalMaterial({
            color: 0xe9f0ef,
            transparent: true,
            opacity: 0.76,
            metalness: 0,
            roughness: 0.74,
            clearcoat: 0.25,
            side: THREE.DoubleSide,
            depthWrite: false
        });
        var tintedGlassMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x1f343d,
            transparent: true,
            opacity: 0.7,
            metalness: 0.05,
            roughness: 0.24,
            clearcoat: 0.65,
            clearcoatRoughness: 0.18,
            side: THREE.DoubleSide,
            depthWrite: false
        });
        var interiorMaterial = new THREE.MeshStandardMaterial({
            color: 0xaab3ba,
            metalness: 0.25,
            roughness: 0.62
        });

        function addBox(size, position, material, parent, shadows) {
            var geometry = new THREE.BoxGeometry(size[0], size[1], size[2]);
            var mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(position[0], position[1], position[2]);
            mesh.castShadow = shadows !== false;
            mesh.receiveShadow = shadows !== false;
            (parent || booth).add(mesh);
            return mesh;
        }

        function disposeBooth() {
            if (!booth) {
                return;
            }
            booth.traverse(function (object) {
                if (object.geometry) {
                    object.geometry.dispose();
                }
            });
            scene.remove(booth);
            booth = null;
        }

        function getPanelMaterial(finish) {
            if (finish === "frosted") {
                return frostedGlassMaterial;
            }
            if (finish === "tinted") {
                return tintedGlassMaterial;
            }
            return clearGlassMaterial;
        }

        function addBench(width, x, z, rotation) {
            var bench = new THREE.Group();
            bench.position.set(x, 0, z);
            bench.rotation.y = rotation || 0;
            booth.add(bench);
            addBox([width, 0.16, 0.74], [0, 1.1, 0], interiorMaterial, bench);
            addBox([width, 0.78, 0.14], [0, 1.45, -0.3], interiorMaterial, bench);
            addBox([0.15, 0.94, 0.15], [-width / 2 + 0.18, 0.6, 0], darkMaterial, bench);
            addBox([0.15, 0.94, 0.15], [width / 2 - 0.18, 0.6, 0], darkMaterial, bench);
        }

        function buildBooth(config, frameColor, finish) {
            var width = config.width;
            var depth = config.depth;
            var height = 5.4;
            var post = 0.18;
            var beam = 0.2;
            var sideX = width / 2 - post / 2;
            var sideZ = depth / 2 - post / 2;
            var lowY = beam / 2;
            var highY = height - beam / 2;
            var doorWidth = 1.62;
            var doorCenter = width / 2 - doorWidth / 2 - post;
            var fixedWidth = width - doorWidth - post * 3;
            var fixedCenter = -width / 2 + fixedWidth / 2 + post;
            var panelMaterial = getPanelMaterial(finish);
            var ventPositions = config.vents === 2 ? [-width * 0.22, width * 0.22] : [0];
            var support;

            disposeBooth();
            frameMaterial.color.set(frameColor);
            darkMaterial.color.copy(frameMaterial.color).multiplyScalar(0.43);
            frameMaterial.needsUpdate = true;
            darkMaterial.needsUpdate = true;

            booth = new THREE.Group();
            booth.rotation.y = -0.1;
            scene.add(booth);

            [[-sideX, -sideZ], [sideX, -sideZ], [-sideX, sideZ], [sideX, sideZ]].forEach(function (point) {
                addBox([post, height, post], [point[0], height / 2, point[1]], frameMaterial);
            });

            if (width > 5) {
                for (support = -1; support <= 1; support += 2) {
                    addBox([post, height, post], [0, height / 2, sideZ * support], frameMaterial);
                }
            }

            [lowY, highY].forEach(function (y) {
                addBox([width, beam, post], [0, y, -sideZ], frameMaterial);
                addBox([width, beam, post], [0, y, sideZ], frameMaterial);
                addBox([post, beam, depth], [-sideX, y, 0], frameMaterial);
                addBox([post, beam, depth], [sideX, y, 0], frameMaterial);
            });

            addBox([width - 0.35, height - 0.45, 0.05], [0, height / 2, -depth / 2], panelMaterial, booth, false);
            addBox([0.05, height - 0.45, depth - 0.35], [-width / 2, height / 2, 0], panelMaterial, booth, false);
            addBox([0.05, height - 0.45, depth - 0.35], [width / 2, height / 2, 0], panelMaterial, booth, false);
            addBox([fixedWidth, height - 0.45, 0.05], [fixedCenter, height / 2, depth / 2], panelMaterial, booth, false);

            var door = new THREE.Group();
            door.position.set(doorCenter, 0, depth / 2);
            booth.add(door);
            addBox([doorWidth, height - 0.45, 0.05], [0, height / 2, 0], clearGlassMaterial, door, false);
            addBox([post, height - 0.3, post], [-doorWidth / 2, height / 2, 0], frameMaterial, door);
            addBox([post, height - 0.3, post], [doorWidth / 2, height / 2, 0], frameMaterial, door);
            addBox([doorWidth + post, beam, post], [0, lowY, 0], frameMaterial, door);
            addBox([doorWidth + post, beam, post], [0, highY, 0], frameMaterial, door);
            addBox([0.09, 0.72, 0.12], [-doorWidth * 0.3, 2.65, 0.12], accentMaterial, door);

            addBox([post, height - 0.25, post], [doorCenter - doorWidth / 2 - post, height / 2, sideZ], frameMaterial);
            addBox([width - 0.15, 0.16, depth - 0.15], [0, 0.18, 0], darkMaterial);
            addBox([width - 0.18, 0.18, depth - 0.18], [0, height - 0.12, 0], frameMaterial);

            ventPositions.forEach(function (ventX) {
                addBox([2.15, 0.4, 1.55], [ventX, height + 0.2, -0.1], darkMaterial);
                addBox([1.55, 0.14, 0.92], [ventX, height + 0.48, -0.1], accentMaterial);
                [-0.36, -0.12, 0.12, 0.36].forEach(function (ventZ) {
                    addBox([1.18, 0.035, 0.07], [ventX, height + 0.57, ventZ - 0.1], darkMaterial);
                });
            });

            if (config.benches === 1) {
                addBench(Math.min(width - 0.65, 2.7), 0, -depth / 2 + 0.5, 0);
            } else {
                addBench(Math.min((width - 1) / 2, 2.55), -width * 0.25, -depth / 2 + 0.5, 0);
                addBench(Math.min((width - 1) / 2, 2.55), width * 0.25, -depth / 2 + 0.5, 0);
            }

            var ashtray = new THREE.Mesh(
                new THREE.CylinderGeometry(0.18, 0.24, 1.12, 24),
                frameMaterial
            );
            ashtray.position.set(-width / 2 + 0.56, 0.74, depth * 0.12);
            ashtray.castShadow = true;
            booth.add(ashtray);

            var ashtrayTop = new THREE.Mesh(
                new THREE.CylinderGeometry(0.3, 0.3, 0.08, 24),
                accentMaterial
            );
            ashtrayTop.position.set(-width / 2 + 0.56, 1.32, depth * 0.12);
            ashtrayTop.castShadow = true;
            booth.add(ashtrayTop);

            target.set(0, height * 0.47, 0);
            distance = Math.max(12.2, Math.max(width, depth) * 2.05);
            updateCamera();
        }

        function updateCamera() {
            var aspectScale = Math.max(1, 0.82 / Math.max(camera.aspect, 0.1));
            var viewDistance = distance * aspectScale;
            var horizontal = viewDistance * Math.cos(pitch);
            camera.position.set(
                target.x + horizontal * Math.sin(yaw),
                target.y + viewDistance * Math.sin(pitch),
                target.z + horizontal * Math.cos(yaw)
            );
            camera.lookAt(target);
        }

        function resize() {
            var widthPx = Math.max(container.clientWidth, 1);
            var heightPx = Math.max(container.clientHeight, 1);
            renderer.setSize(widthPx, heightPx, false);
            camera.aspect = widthPx / heightPx;
            camera.updateProjectionMatrix();
            updateCamera();
        }

        function render() {
            if (!running) {
                return;
            }
            if (!Object.keys(pointers).length && Date.now() - lastInteraction > 3200) {
                yaw += 0.0014;
                updateCamera();
            }
            renderer.render(scene, camera);
            frameId = window.requestAnimationFrame(render);
        }

        function pointerDistance() {
            var keys = Object.keys(pointers);
            if (keys.length < 2) {
                return 0;
            }
            var first = pointers[keys[0]];
            var second = pointers[keys[1]];
            return Math.hypot(first.x - second.x, first.y - second.y);
        }

        renderer.domElement.addEventListener("pointerdown", function (event) {
            renderer.domElement.setPointerCapture(event.pointerId);
            pointers[event.pointerId] = { x: event.clientX, y: event.clientY };
            lastPointer = { x: event.clientX, y: event.clientY };
            pinchDistance = pointerDistance();
            lastInteraction = Date.now();
        });

        renderer.domElement.addEventListener("pointermove", function (event) {
            if (!pointers[event.pointerId]) {
                return;
            }

            pointers[event.pointerId] = { x: event.clientX, y: event.clientY };
            var keys = Object.keys(pointers);

            if (keys.length > 1) {
                var nextPinchDistance = pointerDistance();
                if (pinchDistance > 0 && nextPinchDistance > 0) {
                    distance = THREE.MathUtils.clamp(distance * pinchDistance / nextPinchDistance, 7.5, 20);
                    updateCamera();
                }
                pinchDistance = nextPinchDistance;
            } else if (lastPointer) {
                yaw -= (event.clientX - lastPointer.x) * 0.008;
                pitch += (event.clientY - lastPointer.y) * 0.006;
                pitch = THREE.MathUtils.clamp(pitch, -0.06, 1.05);
                updateCamera();
            }

            lastPointer = { x: event.clientX, y: event.clientY };
            lastInteraction = Date.now();
        });

        function releasePointer(event) {
            delete pointers[event.pointerId];
            lastPointer = null;
            pinchDistance = pointerDistance();
            lastInteraction = Date.now();
        }

        renderer.domElement.addEventListener("pointerup", releasePointer);
        renderer.domElement.addEventListener("pointercancel", releasePointer);
        renderer.domElement.addEventListener("wheel", function (event) {
            event.preventDefault();
            distance = THREE.MathUtils.clamp(distance * Math.exp(event.deltaY * 0.001), 7.5, 20);
            updateCamera();
            lastInteraction = Date.now();
        }, { passive: false });

        updateCamera();
        resize();

        return {
            start: function () {
                resize();
                if (!running) {
                    running = true;
                    render();
                }
            },
            stop: function () {
                running = false;
                if (frameId !== null) {
                    window.cancelAnimationFrame(frameId);
                    frameId = null;
                }
            },
            resize: resize,
            setConfiguration: buildBooth
        };
    }

    function showFallback() {
        loading.hidden = true;
        fallback.hidden = false;
    }

    function openModal(event) {
        previousFocus = event.currentTarget;
        modal.hidden = false;
        document.body.classList.add("product-model-open");

        window.requestAnimationFrame(function () {
            try {
                if (!viewer) {
                    viewer = createViewer(viewport);
                    loading.hidden = true;
                }
                updateConfiguration();
                viewer.start();
            } catch (error) {
                showFallback();
            }
            closeButton.focus();
        });
    }

    function closeModal() {
        if (modal.hidden) {
            return;
        }
        modal.hidden = true;
        document.body.classList.remove("product-model-open");
        if (viewer) {
            viewer.stop();
        }
        if (previousFocus) {
            previousFocus.focus();
        }
    }

    modal.querySelectorAll("[data-cabin]").forEach(function (button) {
        button.addEventListener("click", function () {
            state.cabin = button.getAttribute("data-cabin");
            updateConfiguration();
        });
    });

    modal.querySelectorAll("[data-frame-color]").forEach(function (button) {
        button.addEventListener("click", function () {
            state.color = button.getAttribute("data-frame-color");
            updateConfiguration();
        });
    });

    modal.querySelectorAll("[data-finish]").forEach(function (button) {
        button.addEventListener("click", function () {
            state.finish = button.getAttribute("data-finish");
            updateConfiguration();
        });
    });

    resetButton.addEventListener("click", function () {
        state.cabin = DEFAULT_STATE.cabin;
        state.color = DEFAULT_STATE.color;
        state.finish = DEFAULT_STATE.finish;
        updateConfiguration();
    });

    openButtons.forEach(function (button) {
        button.addEventListener("click", openModal);
    });

    closeElements.forEach(function (element) {
        element.addEventListener("click", closeModal);
    });

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape" && !modal.hidden) {
            closeModal();
        }
    });

    window.addEventListener("resize", function () {
        if (viewer && !modal.hidden) {
            viewer.resize();
        }
    });
}());
