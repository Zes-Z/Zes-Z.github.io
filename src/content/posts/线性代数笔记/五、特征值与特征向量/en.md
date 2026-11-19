
## Introduction
:::defi[eigenvector]

:::

:::defi[eigenvalue]

:::

### $Ax=\lambda x$ 与 $det(A-\lambda I)=0$



### $det(A)$ 与 $det(A+\mu I)$




### Matrix $level$



---
## Diagonalization

### Diagonalization of a Matrix
:::defi[$A=X\Lambda X^{-1}$]

:::

### Applications of Diagonalization: A$^k$

#### Difference Equations
:::defi[Fibonacci Sequence]

:::


#### Markov Processes
:::defi[Markov Matrix]

:::



#### System Stability

$$
\textbf{u}_k=X\Lambda^k X^{-1} u_0=c_1\lambda_1^k x_1+ \cdots +c_n\lambda_n^k x_n
$$







#### Matrix Exponential $e^{At}$



---
## Spectral Theorem
:::defi
* Every real symmetric matrix can be diagonalized by an orthogonal matrix. 
$$
A = QΛQT
$$
* Every Hermitian matrix can be diagonalized by a unitary matrix.
$$
A=UΛU^H
$$
* The columns of Q or U contain a complete set of orthonormal eigenvectors
> [!caution/Note]
> 实对称Matrices的不同特征值对应正交特征向量
:::

:::note[Generalizations of the Spectral Theorem]
* $A^H = A^HA$
* 正规Matrices总是有一个完备的标准正交特征向量集
* 示例：厄米Matrices、斜厄米Matrices和酉Matrices
* 如果$A$是正规的，$AA^H$是厄米Matrices
:::

### Special Complex Matrices




### Properties of the Conjugate Transpose



### Properties of the Skew-Hermitian Transpose




### Diagonalization of the Conjugate Transpose





### Symmetric Decomposition of a Matrix




### Similar Matrices and Similarity Transformations




### Schur’s Lemma





---
## Jordan Form

:::tip
defective matrix 未必有相同的特征值，但必定有相同的特征向量
:::






---
## Positive Definite Matrices
:::defi[Definition]
$$
x^TAx>0
$$
or
* All the eigenvalues of A: $λ_i > 0$
* All the upper left submatrices A$_k$ have positive determinants
* All the pivots of A: $d_i > 0$, because $d_i=\frac{det(A_i)}{det(A_{i-1})}$
* There is a matrix R with independent columns generating A = R$^T$R
:::


### Quadratic Forms




### $n$-Dimensional Ellipsoids




### Ellipsoids and Eigenvalues/Eigenvectors




### Positive Semidefinite Matrices
