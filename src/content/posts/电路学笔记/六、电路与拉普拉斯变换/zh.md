
## 拉普拉斯变换

### 拉普拉斯变换公式


### 拉普拉斯逆变换公式


---
## $S$域中的电路分析

### $S$域中的$KCL$与$KVL$



### $S$域中的元件模型
#### 电阻





#### 电感





#### 电容





---
## 转移函数
### 转移函数的定义
:::defi
$Y(s)$为输出信号的拉普拉斯变换$，X(s)$为输入信号的拉普拉斯变换。   
转移函数$H(s)$与$Y(s)$和$X(s)$的关系式为
$$
H(s)=\frac{Y(s)}{X(s)}
$$
其中
 
当输入信号变为$X'(s)$时，对应的输出信号为
$$
\begin{aligned}
    Y'(s)&=H(s)X'(s)\\
    &=\frac{Y(s)}{X(s)}X'(s)
\end{aligned}
$$
> [!caution/注]
> 暂态解必定来源于转移函数的极点，稳态解必定来源于输入电源的零点
:::

### 转移函数的应用




### 转移函数与重叠原理
:::vital[转移函数与重叠原理]
若电路中存在两个或多个电压源、电流源  
依据重叠原理得到的多个$H_{V_n/I_n}(s)$，是`n个输入分别单独作用下的输出响应的转移函数`。  
因此，完整的系统实际上是：
$$
\begin{aligned}
Y(s)&=H_{V_1}(s) V_{s_1}(s)+H_{I_1}(s) I_{s_1}(s)+...+H_{V_n}(s) V_{s_n}(s)+H_{I_n}(s) I_{s_n}(s)\\
&=\sum_{k=1}^n [H_{V_k}(s) V_{s_k}(s)+H_{I_k}(s) I_{s_k}(s)]
\end{aligned}

$$
:::


## 弦波稳态分析
:::tip
转移函数 $H(s)$ 在正弦稳态分析中可以直接取
$$
s=j\omega
$$
则
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