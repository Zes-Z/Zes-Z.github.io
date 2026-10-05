
## 引言
:::defi[eigenvector]

:::

:::defi[eigenvalue]

:::

### $Ax=\lambda x$ 与 $det(A-\lambda I)=0$



### $det(A)$ 与 $det(A+\mu I)$




### 矩阵的 $level$



---
## 对角化

### 矩阵的对角化形式
:::defi[$A=X\Lambda X^{-1}$]

:::

### 对角化的应用 A$^k$

#### 差分方程
:::defi[斐波那契数列]

:::


#### 马尔科夫过程
:::defi[马尔科夫矩阵]

:::



#### 系统稳定

$$
\textbf{u}_k=X\Lambda^k X^{-1} u_0=c_1\lambda_1^k x_1+ \cdots +c_n\lambda_n^k x_n
$$







#### 矩阵的指数 $e^{At}$



---
## 谱定理
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
> [!caution/注]
> 实对称矩阵的不同特征值对应正交特征向量
:::

:::note[具有谱定理的一般情况]
* $A^H = A^HA$
* 正规矩阵总是有一个完备的标准正交特征向量集
* 示例：厄米矩阵、斜厄米矩阵和酉矩阵
* 如果$A$是正规的，$AA^H$是厄米矩阵
:::

### 特殊的复数矩阵




### 共轭转置矩阵的性质



### 反共轭转置矩阵的性质




### 共轭转置矩阵的对角化





### 矩阵的对称拆解




### 相似矩阵与相似变换




### Schur’s Lemma





---
## 若尔当形

:::tip
defective matrix 未必有相同的特征值，但必定有相同的特征向量
:::






---
## 正定矩阵
:::defi[定义]
$$
x^TAx>0
$$
or
* All the eigenvalues of A: $λ_i > 0$
* All the upper left submatrices A$_k$ have positive determinants
* All the pivots of A: $d_i > 0$, because $d_i=\frac{det(A_i)}{det(A_{i-1})}$
* There is a matrix R with independent columns generating A = R$^T$R
:::


### 二次型




### $n$维的椭球




### 椭球体和特征值/特征向量




### 半正定矩阵
