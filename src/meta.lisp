;; Rung 3 — meta (Lisp/SBCL). Bottom-up: cluster reasons by co-occurrence
;; (union-find connected components). The cluster structure is itself
;; s-expression data (homoiconic) — the emergent "ethical space" is DERIVED
;; from the corpus, not declared. Reads groups from stdin, writes clusters.
(defvar *parent* (make-hash-table :test 'equal))
(defun root (x)
  (let ((p (gethash x *parent* x)))
    (if (equal p x) x (setf (gethash x *parent*) (root p)))))
(defun link (a b) (setf (gethash (root a) *parent*) (root b)))
(let ((groups (read)))                 ; ((r1 r2) (r3 r4) ...)
  (dolist (g groups)
    (dolist (r g) (gethash r *parent* (setf (gethash r *parent*) r)))
    (loop for r in (cdr g) do (link (car g) r)))
  (let ((clusters (make-hash-table :test 'equal)))
    (loop for r being the hash-keys of *parent*
          do (pushnew r (gethash (root r) clusters) :test #'equal))
    (format t "(")
    (loop for c being the hash-values of clusters
          do (format t "(~{~a~^ ~})" c))
    (format t ")~%")))
