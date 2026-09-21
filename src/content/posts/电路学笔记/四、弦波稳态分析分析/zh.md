## 向量分析
### 前置三角函数知识 
:::tip[正弦、余弦互化与叠加]
由
$$

$$
可得
$$
sin(\omega t+\theta)=cos(\omega t+\theta-\frac{\pi}{2})
$$

$$
-sin(\omega t+\theta)=cos(\omega t+\theta+\frac{\pi}{2})
$$

$$
-cos(\omega t+\theta)=cos(\omega t+\theta+\pi)
$$

$$
Acos(\omega t)+Bsin(\omega t)= Ccos(\omega t-\theta) = C(cos\omega t cos\theta+sin\omega t sin\theta)
$$
其中 
$$
C=\sqrt{A^2+B^2} ，\theta=\tan^{-1}\frac{B}{A}
$$
:::

:::definition[欧拉公式]
$$
e^{j\theta}=cos\theta+j sin\theta=1\angle \theta
$$
:::

### 相量变换
$$

$$




## 相域的元件模型
### 相域中的电阻
:::caution
$$
V(t)=R i(t)，i(t)=\frac{1}{R}V(t)=GV(t)
$$
$$
设i(t)=I_m cos(\omega t+\theta)，\vec{I}=I_m \angle \theta
$$
则
$$
V(t)=R I_m cos(\omega t+\theta)
$$
两边同时进行相域转换
$$
\vec{V}=R I_m\angle \theta=R\vec{I}
$$
因此
$$
Z=\frac{\vec{V}}{\vec{I}}=R
$$
:::



### 相域中的电感
:::caution
$$
V(t)=L\frac{di(t)}{dt}，i_L(t)= i_L(0)+\frac{1}{L}\int_0^{\tau} V(\tau)\,d\tau
$$
本章主要探讨交流`稳态`分析，故：
$$
i_L(t)=\frac{1}{L}\int_{-\infin}^{\tau} V(\tau)\,d\tau
$$
设
$$
i(t)=I_m cos(\omega t+\theta)，\vec{I}=I_m \angle \theta
$$
则
$$
\begin{aligned}
V(t) &=L\frac{d}{dt}\left[I_m cos(\omega t+\theta)\right]
=-\omega L I_m sin(\omega t+\theta)\\
&=\omega L I_m cos(\omega t+\theta+90^\circ)
\end{aligned}
$$
两边同时进行相域转换
$$
\begin{aligned}
\vec{V}&=\omega L I_m\angle(\theta+90^\circ)\\
&=\omega L I_m e^{j(\theta+90^\circ)}=\omega L I_m e^{j\theta}e^{j90^\circ}\\
&=j\omega L I_m\angle\theta\\
&=j\omega L\vec{I}
\end{aligned}
$$
因此
$$
Z_L=\frac{\vec{V}}{\vec{I}}=j\omega L
$$
:::



### 相域中的电容
:::caution
$$
i_C(t)=C\frac{dV(t)}{dt}，V(t)=V(0)+\frac{1}{C}\int_0^{t}i_C(\tau)\,d\tau
$$
本章主要探讨交流`稳态`分析，故：
$$
V_c(t)=\frac{1}{C}\int_{-\infin}^{t}i_C(\tau)\,d\tau
$$
设
$$
V(t)=V_m cos(\omega t+\theta)，\vec{V}=V_m \angle \theta
$$
则
$$
\begin{aligned}
i_C(t)&=C\frac{d}{dt}\left[V_m cos(\omega t+\theta)\right]
=-\omega C V_m sin(\omega t+\theta)\\
&=\omega C V_m cos(\omega t+\theta+90^\circ)
\end{aligned}
$$
两边同时进行相域转换
$$
\begin{aligned}
\vec{I}&=\omega C V_m\angle(\theta+90^\circ)\\
&=\omega C V_m e^{j(\theta+90^\circ)}=\omega C V_m e^{j\theta}e^{j90^\circ}\\
&=j\omega C V_m\angle\theta\\
&=j\omega C\vec{V}
\end{aligned}
$$
因此
$$
Z_C=\frac{\vec{V}}{\vec{I}}
=\frac{1}{j\omega C}
=-\frac{j}{\omega C}
$$
:::


## 阻抗$Z(impedance)$与导纳$Y(admittance)$
:::note
$$
Z=R+jX
$$
$$
Y=\frac{1}{Z}
$$
$$
Y=G+jB=\frac{1}{R+jX}=\frac{R}{R^2+X^2}-j\frac{X}{R^2+X^2}
$$
> [!caution]
> 相域中的$R$与$G$、$X$与$B$不再互为倒数!
:::



## 相域的节点电压法与网目电流法
### 相域中的KCL、KVL
:::tip

弦波电流
$$
i_K(t)=I_{mK}cos(\omega t+\theta_K)
$$
由 $KCL$ 流出节点的总电流和为0（以流入为负）
$$
\sum_{K=1}^n I_K=0
$$
可得
$$
\sum_{K=1}^n I_{mK}cos(\omega t+\theta_K) =0
$$
两边同时进行相域转换
$$
\sum_{K=1}^n I_{mK}\angle \theta_K =0+j0，
\text{or } \vec{I}_1+\vec{I}_2+...+\vec{I}_n=0
$$
:::

:::tip
弦波电压
$$
V_K(t)=V_{mK}cos(\omega t+\phi_K)
$$

由 $KVL$ 经过元件的总压降和为0（以压降为正）
$$
\sum_{K=1}^n V_K=0
$$
可得
$$
\sum_{K=1}^n V_{mK}cos(\omega t+\phi_K) =0
$$
两边同时进行相域转换
$$
\sum_{K=1}^n V_{mK}\angle \phi_K =0+j0，
\text{or } \vec{V}_1+\vec{V}_2+...+\vec{V}_n=0
$$
:::


<!-- ## 相域与时域解法的一致性 -->



## 相域的重叠原理



## 相域的戴维宁-诺顿等效电路

:::note[电源转换]

:::





## 交流稳态功率分析
### 交流电功率
若
$$
V(t)=V_m cos(\omega t+\theta_v)，\vec{V}=V_m \angle{\theta_v}
$$
$$
i(t)=I_m cos(\omega t+\theta_i)，\vec{I}=I_m \angle{\theta_i}
$$
不妨设
$$
V(t)=V_m cos(\omega t+\theta_v-\theta_i)
$$
$$
i(t)=I_m cos(\omega t)
$$
则

:::definition[瞬时功率 Instantaneous power]
$$
\begin{aligned}
p(t)&=V(t)i(t) \tag{积化和差}\\
&=V_m cos(\omega t+\theta_v-\theta_i)I_m cos(\omega t) \\
&=\frac{V_m I_m}{2}cos(\theta_v-\theta_i)+\frac{V_m I_m}{2}cos(2\omega t+\theta_v-\theta_i)\\
&=\frac{V_m I_m}{2}cos(\theta_v-\theta_i)+
\frac{V_m I_m}{2}cos(\theta_v-\theta_i)cos(2\omega t)-\frac{V_m I_m}{2}sin(\theta_v-\theta_i)sin(2\omega t)
\end{aligned}
$$
> [!caution]
> 记
> $$
> P=\frac{V_m I_m}{2}cos(\theta_v-\theta_i)，Q=\frac{V_m I_m}{2}sin(\theta_v-\theta_i)
> $$  
> 则
> $$
> p(t)=P+Pcos(2\omega t)-Qsin(2\omega t)
> $$
:::

:::definition[平均功率 Average power (namely, real power)] 
由
$$
p(t)=P+Pcos(2\omega t)-Qsin(2\omega t)
$$
则平均功率为
$$
\frac{1}{T}\int_{t_0}^{t_0+T}p(\tau)\,d\tau=P=\frac{V_m I_m}{2}cos(\theta_v-\theta_i)
$$
:::

:::definition[虚功率 Reactive power (namely, imaginary power)] 
$$
Q=\frac{V_m I_m}{2}sin(\theta_v-\theta_i)
$$
:::

:::definition[复数功率 Complex power] 
$$
\vec{S}=\vec{V}_{rms}\vec{I}_{rms}^*=P+jQ
$$
:::

:::definition[视在功率 Apparent power] 

$$
|\vec{s}|=\sqrt{P^2+Q^2}
$$
:::

:::definition[功率因数 Power factor]
$$
0\le \frac{P}{|\vec{s}|}=\frac{P}{\sqrt{P^2+Q^2}} \le 1
$$
:::


### 复功率守恒






### 最大功率转移

:::definition





当负载$L$的阻抗等于戴维宁等效阻抗的共轭复数时，具有最大功率转移
$$
Z_L = Z_{TH}^*
$$
:::




## 平衡三相电路
### 基本概念
:::note[$Y$连接]

:::

:::note[$\Delta$连接]

:::

### $Y(电源)-Y(负载)连接$




### $Y(电源)-\Delta(负载)连接$





### $\Delta(电源)-Y(负载)连接$




### $\Delta(电源)-\Delta(负载)连接$

