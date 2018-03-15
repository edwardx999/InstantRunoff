declare class Voter {
    vts: number[];
    votes: number[];
    constructor(vts: number[]);
    clone(): Voter;
}
declare function instantRunoff(voters: Voter[], numCandidates: number): number[];
declare function cloneVoterList(voters: Voter[]): Voter[];
declare function mapIndicesToCandidates(indices: number[], candidates: string[]): string[];
