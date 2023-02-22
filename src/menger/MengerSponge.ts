import { Mat3, Mat4, Vec3, Vec4 } from "../lib/TSM.js";

/* A potential interface that students should implement */
interface IMengerSponge {
    setLevel(level: number): void;
    isDirty(): boolean;
    setClean(): void;
    normalsFlat(): Float32Array;
    indicesFlat(): Uint32Array;
    positionsFlat(): Float32Array;
}

/**
 * Represents a Menger Sponge
 */
export class MengerSponge implements IMengerSponge {

    // TODO: sponge data structures
    private m: number = -0.5;
    private M: number = 0.5;

    private level: number = 0;
    private dirty: boolean = false;

    private normals: number[];
    private indices: number[];
    private positions: number[];

    constructor(level: number) {
        this.normals = [];
        this.positions = [];
        this.indices = [];
        this.setLevel(level);
    }

    /**
     * Returns true if the sponge has changed.
     */
    public isDirty(): boolean {
        return this.dirty;
    }

    public setClean(): void {
        this.dirty = false;
    }

    public setLevel(level: number) {
        if (this.level != level) {
            console.log("Building Sponge (level: " + level + ")");
            this.normals = [];
            this.positions = [];
            this.indices = [];
            this.level = level;
            this.buildSponge(this.level, new Vec3([this.m, this.m, this.m]), new Vec3([this.M, this.M, this.M]));
            this.dirty = true;
        }
        else {
            console.log("Same level (" + level + ") as current")
        }
    }

    private buildCube(min: Vec3, max: Vec3): Float32Array {
        let size = max.x - min.x;
        // 6 * 2 = 12 triangles, each with distinct vertices
        return new Float32Array([
            // Bottom Face
            min.x, min.y, min.z, 1.0,
            min.x + size, min.y + size, min.z, 1.0,
            min.x + size, min.y, min.z, 1.0,

            min.x, min.y, min.z, 1.0,
            min.x, min.y + size, min.z, 1.0,
            min.x + size, min.y + size, min.z, 1.0,

            // Top Face
            min.x, min.y, min.z + size, 1.0,
            min.x + size, min.y, min.z + size, 1.0,
            min.x + size, min.y + size, min.z + size, 1.0,

            min.x, min.y, min.z + size, 1.0,
            min.x + size, min.y + size, min.z + size, 1.0,
            min.x, min.y + size, min.z + size, 1.0,

            // Side face 1
            min.x, min.y, min.z, 1.0,
            min.x + size, min.y, min.z, 1.0,
            min.x + size, min.y, min.z + size, 1.0,

            min.x, min.y, min.z, 1.0,
            min.x + size, min.y, min.z + size, 1.0,
            min.x, min.y, min.z + size, 1.0,

            // Side face 2
            min.x + size, min.y, min.z, 1.0,
            min.x + size, min.y + size, min.z, 1.0,
            min.x + size, min.y + size, min.z + size, 1.0,

            min.x + size, min.y, min.z, 1.0,
            min.x + size, min.y + size, min.z + size, 1.0,
            min.x + size, min.y, min.z + size, 1.0,

            // Side face 3
            min.x + size, min.y + size, min.z, 1.0,
            min.x, min.y + size, min.z, 1.0,
            min.x, min.y + size, min.z + size, 1.0,

            min.x + size, min.y + size, min.z, 1.0,
            min.x, min.y + size, min.z + size, 1.0,
            min.x + size, min.y + size, min.z + size, 1.0,

            // Side face 4
            min.x, min.y + size, min.z, 1.0,
            min.x, min.y, min.z, 1.0,
            min.x, min.y, min.z + size, 1.0,

            min.x, min.y + size, min.z, 1.0,
            min.x, min.y, min.z + size, 1.0,
            min.x, min.y + size, min.z + size, 1.0,
        ]);
    }

    // Build Menger Sponge
    private buildSponge(level: number, min: Vec3, max: Vec3): void {
        if (level == 1) {
            let cube = this.buildCube(min, max)
            cube.forEach((pos) => {
                this.positions.push(pos);
            });

            for (let i = 0; i < cube.length; i += 12) {
                let ab: Vec3 = new Vec3([cube[i + 4] - cube[i], cube[i + 5] - cube[i + 1], cube[i + 6] - cube[i + 2]]);
                let ac: Vec3 = new Vec3([cube[i + 8] - cube[i], cube[i + 9] - cube[i + 1], cube[i + 10] - cube[i + 2]]);
                let normal = Vec3.cross(ab, ac);
                for (let j = 0; j < 3; j++) {
                    this.normals.push(normal.x, normal.y, normal.z, 0.0);
                }
            }

            for (let i = 0; i < cube.length / 4; i++) {
                this.indices.push(this.indices.length);
            }
        }
        else {
            const stride = (max.x - min.x) / 3.0;
            for (let x = 0; x < 3; x++) {
                for (let y = 0; y < 3; y++) {
                    for (let z = 0; z < 3; z++) {
                        if (!((x == 1 && y == 1) || (y == 1 && z == 1) || (x == 1 && z == 1))) {
                            let subMin: Vec3 = new Vec3([min.x + stride * x, min.y + stride * y, min.z + stride * z]);
                            let subMax: Vec3 = new Vec3([subMin.x + stride, subMin.y + stride, subMin.z + stride]);
                            this.buildSponge(level - 1, subMin, subMax);
                        }
                    }
                }
            }
        }
    }

    /* Returns a flat Float32Array of the sponge's vertex positions */
    public positionsFlat(): Float32Array {
        return new Float32Array(this.positions);
    }

    /**
     * Returns a flat Uint32Array of the sponge's face indices
     */
    public indicesFlat(): Uint32Array {
        return new Uint32Array(this.indices);
    }

    /**
     * Returns a flat Float32Array of the sponge's normals
     */
    public normalsFlat(): Float32Array {
        return new Float32Array(this.normals);
    }

    /**
     * Returns the model matrix of the sponge
     */
    public uMatrix(): Mat4 {

        // TODO: change this, if it's useful
        const ret: Mat4 = new Mat4().setIdentity();

        return ret;
    }

}
