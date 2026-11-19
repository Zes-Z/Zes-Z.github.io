
## 基本概念
### ポート


### ループのモジュール化


### ネットワーク


### ネットワークパラメータ



---
## 二端子対ループのパラメータの種類
### インピーダンス行列
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


### アドミタンス行列
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

### 伝達行列
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

### 逆伝達行列
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

### ハイブリッド行列
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

### 逆ハイブリッド行列
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
## 6種類の二端子対パラメータの変換
### 行列変換法



### 表を用いる方法



## 特殊なネットワーク
### 相反ネットワーク
:::defi[定义]
将一个端口的電圧源与另一个端口的電流表互换后，電流表的读数不变。
> [!caution/注]
> 源与场可交换，而并非$port1$和$port2$可交换
:::
:::warning[条件]
1. 无主动元件
2. 无铁磁性材料
3. 无电浆
$$
z_{12} = z_{21}\\ y_{12} = y_{21}\\
a_{11}a_{22} − a_{21}a_{12} = 1\\   b_{11}b_{22} − b_{21}b_{12} = 1\\
h_{12} = −h_{21}\\ g_{12} = −g_{21}
$$
:::

### 対称ネットワーク
:::defi[定义]
将双端口网络的两个端口互换，而端口处的電圧和電流数值保持不变，したがって、称该网络为对称网络。

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
## ネットワークパラメータの応用
###