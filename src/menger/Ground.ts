import { Mat3, Mat4, Vec3, Vec4 } from "../lib/TSM.js";

interface IGround {
    normalsFlat(): Float32Array;
    indicesFlat(): Uint32Array;
    positionsFlat(): Float32Array;
}

/**
 * Represents the Ground Plane
 */
export class Ground implements IGround {

    private normals: number[];
    private indices: number[];
    private positions: number[];

    private y = -2.0
    private min = -500.0;
    private max = 500.0;

    constructor() {
        this.normals = [];
        this.positions = [];
        this.indices = [];
        this.buildGround();
    }

    private buildGround(): void {

        let ground = [this.min, this.y, this.min, 1.0,
                        this.min, this.y, this.max, 1.0,
                        this.max, this.y, this.min, 1.0,

                        this.max, this.y, this.max, 1.0,
                        this.max, this.y, this.min, 1.0,
                        this.min, this.y, this.max, 1.0];
        ground.forEach((pos) => {
            this.positions.push(pos);
        });

        for (let i = 0; i < ground.length; i += 12) {
            let ab: Vec3 = new Vec3([ground[i + 4] - ground[i], ground[i + 5] - ground[i + 1], ground[i + 6] - ground[i + 2]]);
            let ac: Vec3 = new Vec3([ground[i + 8] - ground[i], ground[i + 9] - ground[i + 1], ground[i + 10] - ground[i + 2]]);
            let normal = Vec3.cross(ab, ac);
            for (let j = 0; j < 3; j++) {
                this.normals.push(normal.x, normal.y, normal.z, 0.0);
            }
        }

        for (let i = 0; i < ground.length / 4; i++) {
            this.indices.push(this.indices.length);
        }
    }

    /* Returns a flat Float32Array of the ground's vertex positions */
    public positionsFlat(): Float32Array {
        return new Float32Array(this.positions);
    }

    /**
     * Returns a flat Uint32Array of the ground's face indices
     */
    public indicesFlat(): Uint32Array {
        return new Uint32Array(this.indices);
    }

    /**
     * Returns a flat Float32Array of the ground's normals
     */
    public normalsFlat(): Float32Array {
        return new Float32Array(this.normals);
    }

    /**
     * Returns the model matrix of the ground
     */
    public uMatrix(): Mat4 {
        const ret: Mat4 = new Mat4().setIdentity();
        return ret;
    }

}
