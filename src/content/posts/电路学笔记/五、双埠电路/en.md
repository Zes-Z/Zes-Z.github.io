
## Basic Concepts
### Port


### Circuit Modularization


### Network


### Network Parameters



---
## Types of Two-Port Network Parameters
### Impedance Matrix
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


### Admittance Matrix
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

### Transmission Matrix
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

### Inverse Transmission Matrix
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

### Hybrid Matrix
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

### Inverse Hybrid Matrix
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

---
## Conversions among the Six Two-Port Parameter Sets
### Matrix Conversion Method



### Lookup-Table Method



## Special Networks
### Reciprocal Networks
:::defi[定义]
If the voltage source at one port is exchanged with the ammeter at the other port, the ammeter reading remains unchanged.
> [!caution/注]
> 源与场可交换，而并非$port1$和$port2$可交换
:::
:::warning[条件]
1. No active elements
2. No ferromagnetic materials
3. No plasma
$$
z_{12} = z_{21}\\ y_{12} = y_{21}\\
a_{11}a_{22} − a_{21}a_{12} = 1\\   b_{11}b_{22} − b_{21}b_{12} = 1\\
h_{12} = −h_{21}\\ g_{12} = −g_{21}
$$
:::

### Symmetrical Networks
:::defi[定义]
A two-port network is symmetrical if exchanging its two ports leaves the voltage and current values at the ports unchanged.

:::
:::warning[条件]
$$
z_{11} = z_{22}\\ y_{11} = y_{22}\\
a_{11} = a_{22}\\ b_{11} = b_{22}\\
h_{11}h_{22}-h_{12}-h_{21}=1\\ 
g_{11}g_{22}-g_{12}-g_{21}=1
$$
:::

---
## Applications of Network Parameters
###