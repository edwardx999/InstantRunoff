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
var Voter = /** @class */ (function () {
    function Voter(vts) {
        this.vts = vts;
        this.votes = vts;
    }
    Voter.prototype.clone = function () {
        var votes = [];
        var vl = this.votes.length;
        for (var i = 0; i < vl; ++i) {
            votes.push(this.votes[i]);
        }
        return new Voter(votes);
    };
    return Voter;
}());
/*
 * Returns an ordered list of the instant runoff winners of the vote
 * All votes must in range [0,numCandidates)
 * In a tie, whoever had more votes in previous rounds wins. If this ties, losers and winners are chosen based on who is listed first.
 * WARNING: voters is modified!
 */
function instantRunoff(voters, numCandidates) {
    if (numCandidates === 0) {
        return [];
    }
    var Candidate = /** @class */ (function () {
        function Candidate() {
            this.voters = [];
            this.voteHist = 0;
        }
        return Candidate;
    }());
    var winners = [];
    var candidates = [];
    for (var i = 0; i < numCandidates; ++i) {
        candidates.push(new Candidate());
    }
    winners.length = numCandidates;
    var w = 0;
    var l = (numCandidates - 1);
    function findWinner(candidates, numVotes) {
        var needed = Math.ceil(numVotes / 2);
        var winner = -1;
        var prevVotes = -1;
        for (var i = 0; i < numCandidates; ++i) {
            var cand = candidates[i];
            if (cand && cand.voters.length >= needed && cand.voteHist > prevVotes) {
                winner = i;
                prevVotes = cand.voteHist;
            }
        }
        return winner;
    }
    function findLoser(candidates) {
        var min = Infinity;
        var loser = -1;
        var prevVotes = Infinity;
        for (var i = 0; i < numCandidates; ++i) {
            var cand = candidates[i];
            if (cand) {
                var t = cand.voters.length;
                var pv = cand.voteHist;
                if (t < min || t === min && pv < prevVotes) {
                    min = t;
                    loser = i;
                    prevVotes = pv;
                }
            }
        }
        return loser;
    }
    function distVotes(voters, cands) {
        var vl = voters.length;
        for (var i = 0; i < vl; ++i) {
            var voter = voters[i];
            var cand = cands[voter.votes[0]];
            cand.voters.push(voter);
        }
    }
    function assignVoteHist(cands) {
        var cl = cands.length;
        for (var i = 0; i < cl; ++i) {
            var cand = cands[i];
            if (cand) {
                cand.voteHist = cand.voters.length;
            }
        }
    }
    function removeCandidate(voters, cand) {
        var vl = voters.length;
        for (var i = 0; i < vl; ++i) {
            var votes = voters[i].votes;
            for (var j = 0; j < votes.length;) {
                if (votes[j] === cand) {
                    votes.splice(j, 1);
                }
                else {
                    ++j;
                }
            }
        }
    }
    function redistVotes(cands, takefrom) {
        var cand = cands[takefrom];
        var tfl = cand.voters.length;
        for (var i = 0; i < tfl; ++i) {
            var voter = cand.voters[i];
            var votes = voter.votes;
            if (votes.length) {
                cands[votes[0]].voters.push(voter);
            }
        }
        cands[takefrom] = null;
    }
    voters = voters.filter(function (v) { return v.votes.length; });
    distVotes(voters, candidates);
    do {
        for (var winner = findWinner(candidates, voters.length); winner !== -1; winner = findWinner(candidates, voters.length)) {
            winners[w] = winner;
            ++w;
            removeCandidate(voters, winner);
            redistVotes(candidates, winner);
            assignVoteHist(candidates);
            voters = voters.filter(function (v) { return v.votes.length; });
        }
        if (w > l) {
            break;
        }
        var loser = findLoser(candidates);
        removeCandidate(voters, loser);
        winners[l] = loser;
        redistVotes(candidates, loser);
        assignVoteHist(candidates);
        --l;
    } while (w <= l);
    return winners;
}
/*
 * Creates a copy of the list of voters.
 */
function cloneVoterList(voters) {
    var vts = [];
    var vtsl = voters.length;
    for (var i = 0; i < vtsl; ++i) {
        vts.push(voters[i].clone());
    }
    return vts;
}
/*
 * Given a list of indices and a list of candidate names, returns a list of candidates in the order specified by indices.
 */
function mapIndicesToCandidates(indices, candidates) {
    var ret = [];
    var l = indices.length;
    for (var i = 0; i < l; ++i) {
        ret.push(candidates[indices[i]]);
    }
    return ret;
}
//# sourceMappingURL=c:/users/edwar/documents/visual studio 2017/Projects/InstantRunoff/InstantRunoff/instantrunoff.js.map