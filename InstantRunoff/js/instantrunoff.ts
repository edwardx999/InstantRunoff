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
class Voter
{
    public votes: number[];
    constructor(public vts: number[])
    {
        this.votes=vts;
    }
    clone(): Voter
    {
        let votes: number[]=[];
        let vl=this.votes.length;
        for(let i=0;i<vl;++i)
        {
            votes.push(this.votes[i]);
        }
        return new Voter(votes);
    }
}

/* 
 * Returns an ordered list of the instant runoff winners of the vote
 * All votes must in range [0,numCandidates)
 * In a tie, whoever had more votes in previous rounds wins. If this ties, losers and winners are chosen based on who is listed first.
 * WARNING: voters is modified!
 */
function instantRunoff(voters: Voter[],numCandidates: number): number[]
{
    class Candidate
    {
        public voters: Voter[];
        public voteHist: number;
        constructor()
        {
            this.voters=[];
            this.voteHist=0;
        }
    }
    if(numCandidates===0)
    {
        return [];
    }
    let winners: number[]=[];
    let candidates: Candidate[]=[];
    for(let i=0;i<numCandidates;++i)
    {
        candidates.push(new Candidate());
    }
    winners.length=numCandidates;
    let w: number=0;
    let l: number=(numCandidates-1);

    function findWinner(candidates: Candidate[],numVotes: number): number
    {
        let needed: number=Math.ceil(numVotes/2);
        let winner: number=-1;
        let prevVotes: number=-1;
        for(let i=0;i<numCandidates;++i)
        {
            const cand=candidates[i];
            if(cand&&cand.voters.length>=needed&&cand.voteHist>prevVotes)
            {
                winner=i;
                prevVotes=cand.voteHist;
            }
        }
        return winner;
    }

    function findLoser(candidates: Candidate[]): number
    {
        let min=Infinity;
        let loser=-1;
        let prevVotes=Infinity;
        for(let i=0;i<numCandidates;++i)
        {
            const cand=candidates[i];
            if(cand)
            {
                const t=cand.voters.length;
                const pv=cand.voteHist;
                if(t<=min&&pv<prevVotes)
                {
                    min=t;
                    loser=i;
                    prevVotes=pv;
                }
            }
        }
        return loser;
    }

    function distVotes(voters: Voter[],cands: Candidate[]): void
    {
        let vl=voters.length;
        for(let i=0;i<vl;++i)
        {
            const voter=voters[i];
            const cand=cands[voter.votes[0]];
            cand.voters.push(voter);
        }
    }

    function assignVoteHist(cands: Candidate[]): void
    {
        let cl=cands.length;
        for(let i=0;i<cl;++i)
        {
            const cand=cands[i];
            if(cand)
            {
                cand.voteHist=cand.voters.length;
            }
        }
    }

    function removeCandidate(voters: Voter[],cand: number): void
    {
        const vl=voters.length;
        for(let i=0;i<vl;++i)
        {
            const votes=voters[i].votes;
            for(let j=0;j<votes.length;)
            {
                if(votes[j]===cand)
                {
                    votes.splice(j,1);
                }
                else
                {
                    ++j;
                }
            }
        }
    }

    function redistVotes(cands: Candidate[],takefrom: number): void
    {
        const cand=cands[takefrom];
        const tfl: number=cand.voters.length;
        for(let i=0;i<tfl;++i)
        {
            const voter=cand.voters[i];
            const votes=voter.votes;
            if(votes.length)
            {
                cands[votes[0]].voters.push(voter);
            }
        }
        cands[takefrom]=null;
    }

    voters=voters.filter(v => v.votes.length);
    distVotes(voters,candidates);
    do
    {
        for(let winner=findWinner(candidates,voters.length);winner!==-1;winner=findWinner(candidates,voters.length))
        {
            winners[w]=winner;
            ++w;
            removeCandidate(voters,winner);
            redistVotes(candidates,winner);
            assignVoteHist(candidates);
            voters=voters.filter(v => v.votes.length);
        }
        if(w>l)
        {
            break;
        }
        const loser=findLoser(candidates);
        removeCandidate(voters,loser);
        winners[l]=loser;
        redistVotes(candidates,loser);
        assignVoteHist(candidates);
        --l;
    } while(w<=l);

    return winners;
}

/*
 * Creates a copy of the list of voters.
 */
function cloneVoterList(voters: Voter[]): Voter[]
{
    let vts: Voter[]=[];
    const vtsl=voters.length;
    for(let i=0;i<vtsl;++i)
    {
        vts.push(voters[i].clone());
    }
    return vts;
}

/*
 * Given a list of indices and a list of candidate names, returns a list of candidates in the order specified by indices.
 */
function mapIndicesToCandidates(indices: number[],candidates: string[]): string[]
{
    let ret: string[]=[];
    const l=indices.length;
    for(let i=0;i<l;++i)
    {
        ret.push(candidates[indices[i]]);
    }
    return ret;
}

