
## 基本概念
### 埠


### 电路模块化


### 网路


### 网路参数



## 双埠参数的分类
### 阻抗矩阵
:::defi[$Z$ 参数]
$$
\begin{aligned}
\begin{bmatrix}
V_1\\
V_2
\end{bmatrix}
&=
\begin{bmatrix}
Z_{11} & Z_{12}\\
Z_{21} & Z_{22}
\end{bmatrix}
\begin{bmatrix}
I_1\\
I_2
\end{bmatrix}
\end{aligned}
$$
:::
:::tip[$Z$参数的计算]

:::
:::note[$Z$参数的应用]

:::


### 导纳矩阵
:::defi[$Y$ 参数]
$$
\begin{aligned}
\begin{bmatrix}
I_1\\
I_2
\end{bmatrix}
&=
\begin{bmatrix}
Y_{11} & Y_{12}\\
Y_{21} & Y_{22}
\end{bmatrix}
\begin{bmatrix}
V_1\\
V_2
\end{bmatrix}
\end{aligned}
$$
:::

### 传输矩阵
:::defi[$a$ 参数]
$$
\begin{aligned}
\begin{bmatrix}
V_1\\
I_1
\end{bmatrix}
&=
\begin{bmatrix}
a_{11} & a_{12}\\
a_{21} & a_{22}
\end{bmatrix}
\begin{bmatrix}
V_2\\
-I_2
\end{bmatrix}
\end{aligned}
$$
:::

### 逆传输矩阵
:::defi[$b$ 参数]
$$
\begin{aligned}
\begin{bmatrix}
V_2\\
I_2
\end{bmatrix}
&=
\begin{bmatrix}
b_{11} & b_{12}\\
b_{21} & b_{22}
\end{bmatrix}
\begin{bmatrix}
V_1\\
-I_1
\end{bmatrix}
\end{aligned}
$$
:::

### 混合矩阵
:::defi[$h$ 参数]
$$
\begin{aligned}
\begin{bmatrix}
V_1\\
I_2
\end{bmatrix}
&=
\begin{bmatrix}
h_{11} & h_{12}\\
h_{21} & h_{22}
\end{bmatrix}
\begin{bmatrix}
I_1\\
V_2
\end{bmatrix}
\end{aligned}
$$
:::

### 逆混合矩阵
:::defi[$g$ 参数]
$$
\begin{aligned}
\begin{bmatrix}
I_1\\
V_2
\end{bmatrix}
&=
\begin{bmatrix}
g_{11} & g_{12}\\
g_{21} & g_{22}
\end{bmatrix}
\begin{bmatrix}
V_1\\
I_2
\end{bmatrix}
\end{aligned}
$$
:::

