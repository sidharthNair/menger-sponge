export let defaultVSText = `
    precision mediump float;

    attribute vec3 vertPosition;
    attribute vec3 vertColor;
    attribute vec4 aNorm;

    varying vec4 lightDir;
    varying vec4 normal;

    uniform vec4 lightPosition;
    uniform mat4 mWorld;
    uniform mat4 mView;
	uniform mat4 mProj;

    void main () {
		//  Convert vertex to camera coordinates and the NDC
        gl_Position = mProj * mView * mWorld * vec4 (vertPosition, 1.0);

        //  Compute light direction (world coordinates)
        lightDir = lightPosition - vec4(vertPosition, 1.0);

        //  Pass along the vertex normal (world coordinates)
        normal = aNorm;
    }
`;

export let defaultFSText = `
    precision mediump float;

    varying vec4 lightDir;
    varying vec4 normal;

    void main () {
        gl_FragColor = dot(normalize(lightDir), normalize(normal)) * normalize(abs(normal));
        gl_FragColor[3] = 1.0;
    }
`;

export let floorVSText = `
    precision mediump float;

    attribute vec3 vertPosition;
    attribute vec3 vertColor;
    attribute vec4 aNorm;

    varying vec4 lightDir;
    varying vec4 normal;

    varying vec4 vertex;

    uniform vec4 lightPosition;
    uniform mat4 mWorld;
    uniform mat4 mView;
	uniform mat4 mProj;

    void main () {
		//  Convert vertex to camera coordinates and the NDC
        gl_Position = mProj * mView * mWorld * vec4 (vertPosition, 1.0);

        //  Compute light direction (world coordinates)
        lightDir = lightPosition - vec4(vertPosition, 1.0);

        //  Pass along the vertex normal (world coordinates)
        normal = aNorm;

        // Pass vertex coordinates for ground shading
        vertex = vec4(vertPosition, 1.0);
    }
`;

export let floorFSText = `
    precision mediump float;

    varying vec4 lightDir;
    varying vec4 normal;

    varying vec4 vertex;

    void main () {
        if (mod(floor(vertex.x * 0.2) + floor(vertex.y * 0.2) + floor(vertex.z * 0.2), 2.0) == 1.0) {
            gl_FragColor = dot(normalize(lightDir), normalize(normal)) * vec4(0.0, 0.0, 0.0, 1.0);
        }
        else {
            gl_FragColor = dot(normalize(lightDir), normalize(normal)) * vec4(1.0, 1.0, 1.0, 1.0);
        }
        gl_FragColor[3] = 1.0;
    }
`;
