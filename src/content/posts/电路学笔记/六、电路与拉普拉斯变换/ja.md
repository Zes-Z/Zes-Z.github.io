
## ラプラス変換

### ラプラス変換の公式


### 逆ラプラス変換の公式


---
## $S$域中的电路分析

### $S$域中的$KCL$与$KVL$



### $S$域中的素子モデル
#### 抵抗





#### インダクタ





#### コンデンサ





---
## 伝達関数
### 伝達関数の定義
:::defi
$Y(s)$ 为输出信号的ラプラス変換，$X(s)$ 为输入信号的ラプラス変換。   
伝達関数 $H(s)$ 与 $Y(s)$ 和 $X(s)$ 的关系式为
$$
H(s)=\frac{Y(s)}{X(s)}
$$
ここで、
 
当输入信号变为$X'(s)$时，对应的输出信号为
$$
\begin{aligned}
    Y'(s)&=H(s)X'(s)\\
    &=\frac{Y(s)}{X(s)}X'(s)
\end{aligned}
$$
> [!caution/注]
> 暂态解必定来源于伝達関数的极点，稳态解必定来源于输入电源的零点
:::

### 伝達関数の応用




### 伝達関数と重ね合わせの原理
:::vital[伝達関数と重ね合わせの原理]
若电路中存在两个或多个電圧源、電流源  
依据重叠原理得到的多个$H_{V_n/I_n}(s)$，是`n个输入分别单独作用下的输出响应的伝達関数`。  
因此，完整的系统实际上是：
$$
\begin{aligned}
Y(s)&=H_{V_1}(s) V_{s_1}(s)+H_{I_1}(s) I_{s_1}(s)+...+H_{V_n}(s) V_{s_n}(s)+H_{I_n}(s) I_{s_n}(s)\\
&=\sum_{k=1}^n [H_{V_k}(s) V_{s_k}(s)+H_{I_k}(s) I_{s_k}(s)]
\end{aligned}

$$
:::


## 正弦波定常解析
:::tip
伝達関数 $H(s)$ 在正弦稳态分析中可以直接取
$$
s=j\omega
$$
したがって、
$$
H(s)=H(j\omega)=∣H(j\omega)∣\angle \theta(\omega)
$$
当输入信号为
$$
X(s)=Acos(\omega t+\phi)=A\angle \phi
$$
对应的输出信号为
$$
\begin{aligned}
Y(s)&=H(j\omega)X(s)\\
&=∣H(j\omega)∣\angle \theta(\omega) A\angle \phi
=A∣H(j\omega)∣\angle(\theta(\omega)+\phi)\\
Y_{ss}(t)&=A∣H(j\omega)∣cos(\omega t+\theta(\omega)+\phi)
\end{aligned}
$$
:::