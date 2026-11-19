

## Linear Transformations

### Linear Combinations



### Linear Independence and Dependence
:::defi[Definition of Linear Independence and Dependence]
* For $k$ vectors $v1$, $v2$, ..., v$k$, if $c1v1$ + $c2v2$ + ...+ $ck vk$ = 0 only  happens when c1 = c2 = ... = $ck$ = 0, the vectors $v1$, $v2$, ..., $vk$ are linearly independent.
* Otherwise, they are linearly dependent and one of them is a  linear combination of the others. 
:::



---
## Matrices
### Matrix Concepts and Forms
为了简化记录某一Linear Transformations操作的信息
Matrices = Linear Transformations





### Linear Independence and Invertible Matrices
一旦接受了"Matrices = Linear Transformations"的理念，我们马上就想知道：这种操作是否可以逆转？




### Linear Dependence and Singular Matrices





### Common Matrices
#### Identity Matrix






#### Basic Transformation Matrices




### Special Matrices
#### 





#### 





#### 








---
## Basic Matrix Operations

### Inverse Matrix






### Transpose







---
## Four Ways to Understand Matrix Multiplication
在一次Linear Transformations的基础上，再进行一次Linear Transformations
### Inner Products of Rows and Columns



### Columns as Linear Combinations of Columns




### Rows as Linear Combinations of Rows




### Column-Row Outer Product Expansion









---
## Gaussian Elimination
如果直接解
$$
\begin{bmatrix}
a_{11} & a_{12} & a_{13}\\
a_{21} & a_{22} & a_{23}\\
a_{31} & a_{32} & a_{33}
\end{bmatrix}
\begin{bmatrix}
x_1\\
x_2\\
x_3
\end{bmatrix}
=
\begin{bmatrix}
b_1\\
b_2\\
b_3
\end{bmatrix}
$$



---
## A=LU Factorization
:::tip
依据Gaussian Elimination，可以将一个Matrices $A$ 分解为一个下三角Matrices $L$ 与一个上三角Matrices $U$ 相乘：

$$
A = LU
$$

$A = LU$ 也可进一步分解为 $A = LDU$。其中 $L$ 为形如

$$
\begin{bmatrix}
a & 0 & 0\\
b & c & 0\\
d & e & f
\end{bmatrix}
$$

的Matrices，$U$ 为形如

$$
\begin{bmatrix}
a & b & c\\
0 & d & e\\
0 & 0 & f
\end{bmatrix}
$$

的Matrices。

此时求解

$$
Ax = b
$$

即求解

$$
LUx = b
$$

左右同乘 $L^{-1}$：

$$
Ux = L^{-1}b = c
$$

此时可由下而上解出 $x$。
:::




## Gauss-Jordan Method