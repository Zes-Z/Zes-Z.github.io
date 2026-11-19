
## Laplace Transform

### Laplace Transform Formulas


### Inverse Laplace Transform Formulas


---
## $S$域中的电路分析

### $S$域中的$KCL$与$KVL$



### $S$域中的Component Models
#### Resistor





#### Inductor





#### Capacitor





---
## Transfer Functions
### Definition of a Transfer Function
:::defi
$Y(s)$ is the Laplace transform of the output signal, and $X(s)$ is the Laplace transform of the input signal.   
The relationship between the transfer function $H(s)$, $Y(s)$, and $X(s)$ is
$$
H(s)=\frac{Y(s)}{X(s)}
$$
where
 
When the input signal becomes $X'(s)$, the corresponding output is
$$
\begin{aligned}
    Y'(s)&=H(s)X'(s)\\
    &=\frac{Y(s)}{X(s)}X'(s)
\end{aligned}
$$
> [!caution/注]
> 暂态解必定来源于Transfer Functions的极点，稳态解必定来源于输入电源的零点
:::

### Applications of Transfer Functions




### Transfer Functions and the Superposition Principle
:::vital[Transfer Functions and the Superposition Principle]
If a circuit contains two or more voltage or current sources,  
The multiple $H_{V_n/I_n}(s)$ obtained from the superposition principle are the `transfer functions from each of the n inputs to the output, with each input acting alone`.  
Therefore, the complete system is:
$$
\begin{aligned}
Y(s)&=H_{V_1}(s) V_{s_1}(s)+H_{I_1}(s) I_{s_1}(s)+...+H_{V_n}(s) V_{s_n}(s)+H_{I_n}(s) I_{s_n}(s)\\
&=\sum_{k=1}^n [H_{V_k}(s) V_{s_k}(s)+H_{I_k}(s) I_{s_k}(s)]
\end{aligned}

$$
:::


## Sinusoidal Steady-State Analysis
:::tip
In sinusoidal steady-state analysis, the transfer function $H(s)$ can be evaluated directly at
$$
s=j\omega
$$
Then,
$$
H(s)=H(j\omega)=∣H(j\omega)∣\angle \theta(\omega)
$$
当输入信号为
$$
X(s)=Acos(\omega t+\phi)=A\angle \phi
$$
the corresponding output signal is
$$
\begin{aligned}
Y(s)&=H(j\omega)X(s)\\
&=∣H(j\omega)∣\angle \theta(\omega) A\angle \phi
=A∣H(j\omega)∣\angle(\theta(\omega)+\phi)\\
Y_{ss}(t)&=A∣H(j\omega)∣cos(\omega t+\theta(\omega)+\phi)
\end{aligned}
$$
:::