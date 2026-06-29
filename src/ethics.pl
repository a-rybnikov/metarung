% Rung 2 — logic (Prolog). At runtime the dynamic cites/2 facts (one per cited
% reason found at the surface) are prepended to these static rules, then the
% program is consulted by tau-prolog.
%
% conflicts/2 declares which KINDS of appeal pull against which. This is not a
% taxonomy of ethics; it is only a small set of known oppositions. A *live*
% tension exists when the corpus actually cites both sides of a conflict, so the
% tensions reported are the ones present in the data, not the ones a theorist expects.

conflicts(maximize_welfare, duty_over_consequences).
conflicts(maximize_welfare, protect_vulnerable).
conflicts(self_continuation, equal_worth).

% a live tension: both sides of a declared conflict appear in the corpus
tension(A, B) :- conflicts(A, B), cites(_, A), cites(_, B).

% which justifications appeal to which reasons
appeals(J, R) :- cites(J, R).
