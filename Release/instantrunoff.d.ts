/*
Copyright(C) 2018 Edward Xie

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.
*/
declare class Voter {
    vts: number[];
    votes: number[];
    constructor(vts: number[]);
    clone(): Voter;
}
declare function instantRunoff(voters: Voter[], numCandidates: number): number[];
declare function cloneVoterList(voters: Voter[]): Voter[];
declare function mapIndicesToCandidates(indices: number[], candidates: string[]): string[];
