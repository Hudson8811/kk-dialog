/* global THREE */

(function () {
    "use strict";

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
    var previousFocus = null;
    var viewer = null;

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

        scene.add(new THREE.HemisphereLight(0xf8fbff, 0x64707a, 2.1));

        var keyLight = new THREE.DirectionalLight(0xffffff, 3.1);
        keyLight.position.set(6, 10, 8);
        keyLight.castShadow = true;
        keyLight.shadow.mapSize.set(2048, 2048);
        keyLight.shadow.camera.left = -8;
        keyLight.shadow.camera.right = 8;
        keyLight.shadow.camera.top = 9;
        keyLight.shadow.camera.bottom = -5;
        scene.add(keyLight);

        var fillLight = new THREE.DirectionalLight(0x9ed8ff, 1.35);
        fillLight.position.set(-7, 5, -5);
        scene.add(fillLight);

        var rimLight = new THREE.PointLight(0x30e97d, 1.8, 15);
        rimLight.position.set(-4, 4, 5);
        scene.add(rimLight);

        var floorMaterial = new THREE.MeshStandardMaterial({
            color: 0xd8dddf,
            metalness: 0,
            roughness: 0.85
        });
        var floor = new THREE.Mesh(new THREE.CircleGeometry(7.2, 80), floorMaterial);
        floor.rotation.x = -Math.PI / 2;
        floor.position.y = -0.04;
        floor.receiveShadow = true;
        scene.add(floor);

        var booth = new THREE.Group();
        booth.rotation.y = -0.1;
        scene.add(booth);

        var frameMaterial = new THREE.MeshStandardMaterial({
            color: 0x27313d,
            metalness: 0.72,
            roughness: 0.35
        });
        var darkMaterial = new THREE.MeshStandardMaterial({
            color: 0x111a25,
            metalness: 0.55,
            roughness: 0.45
        });
        var accentMaterial = new THREE.MeshStandardMaterial({
            color: 0x25ca6a,
            emissive: 0x072d19,
            metalness: 0.2,
            roughness: 0.34
        });
        var glassMaterial = new THREE.MeshPhysicalMaterial({
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

        var width = 4.4;
        var depth = 3.4;
        var height = 5.4;
        var post = 0.18;
        var beam = 0.2;
        var sideX = width / 2 - post / 2;
        var sideZ = depth / 2 - post / 2;
        var lowY = beam / 2;
        var highY = height - beam / 2;

        [[-sideX, -sideZ], [sideX, -sideZ], [-sideX, sideZ], [sideX, sideZ]].forEach(function (point) {
            addBox([post, height, post], [point[0], height / 2, point[1]], frameMaterial);
        });

        [lowY, highY].forEach(function (y) {
            addBox([width, beam, post], [0, y, -sideZ], frameMaterial);
            addBox([width, beam, post], [0, y, sideZ], frameMaterial);
            addBox([post, beam, depth], [-sideX, y, 0], frameMaterial);
            addBox([post, beam, depth], [sideX, y, 0], frameMaterial);
        });

        addBox([width - 0.35, height - 0.45, 0.045], [0, height / 2, -depth / 2], glassMaterial, booth, false);
        addBox([0.045, height - 0.45, depth - 0.35], [-width / 2, height / 2, 0], glassMaterial, booth, false);
        addBox([0.045, height - 0.45, depth - 0.35], [width / 2, height / 2, 0], glassMaterial, booth, false);

        var door = new THREE.Group();
        door.position.set(0.48, 0, depth / 2);
        booth.add(door);
        addBox([2.35, height - 0.45, 0.05], [0, height / 2, 0], glassMaterial, door, false);
        addBox([post, height - 0.3, post], [-1.18, height / 2, 0], frameMaterial, door);
        addBox([post, height - 0.3, post], [1.18, height / 2, 0], frameMaterial, door);
        addBox([2.52, beam, post], [0, lowY, 0], frameMaterial, door);
        addBox([2.52, beam, post], [0, highY, 0], frameMaterial, door);
        addBox([0.09, 0.72, 0.12], [-0.83, 2.65, 0.12], accentMaterial, door);

        addBox([1.42, height - 0.45, 0.045], [-1.45, height / 2, depth / 2], glassMaterial, booth, false);
        addBox([post, height - 0.25, post], [-0.72, height / 2, sideZ], frameMaterial);

        addBox([width - 0.15, 0.16, depth - 0.15], [0, 0.18, 0], darkMaterial);
        addBox([width - 0.18, 0.18, depth - 0.18], [0, height - 0.12, 0], frameMaterial);

        var canopy = addBox([2.7, 0.42, 1.85], [0, height + 0.22, -0.1], darkMaterial);
        canopy.castShadow = true;
        addBox([1.82, 0.16, 1.12], [0, height + 0.52, -0.1], accentMaterial);
        for (var vent = -0.58; vent <= 0.58; vent += 0.29) {
            addBox([1.42, 0.035, 0.08], [0, height + 0.62, vent - 0.1], darkMaterial);
        }

        addBox([3.3, 0.16, 0.78], [0, 1.12, -1.12], interiorMaterial);
        addBox([3.3, 0.82, 0.14], [0, 1.48, -1.43], interiorMaterial);
        addBox([0.18, 0.95, 0.18], [-1.35, 0.62, -1.12], darkMaterial);
        addBox([0.18, 0.95, 0.18], [1.35, 0.62, -1.12], darkMaterial);

        var ashtray = new THREE.Mesh(
            new THREE.CylinderGeometry(0.18, 0.24, 1.12, 24),
            frameMaterial
        );
        ashtray.position.set(-1.55, 0.74, 0.45);
        ashtray.castShadow = true;
        booth.add(ashtray);

        var ashtrayTop = new THREE.Mesh(
            new THREE.CylinderGeometry(0.3, 0.3, 0.08, 24),
            accentMaterial
        );
        ashtrayTop.position.set(-1.55, 1.32, 0.45);
        ashtrayTop.castShadow = true;
        booth.add(ashtrayTop);

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
                    distance = THREE.MathUtils.clamp(distance * pinchDistance / nextPinchDistance, 8, 18);
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
            distance = THREE.MathUtils.clamp(distance * Math.exp(event.deltaY * 0.001), 8, 18);
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
            resize: resize
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
