## フェーザ解析
### 三角関数の基礎知識 
:::tip[正弦、余弦互化与叠加]
より
$$

$$
が得られる
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
ここで、 
$$
C=\sqrt{A^2+B^2} ,\theta=\tan^{-1}\frac{B}{A}
$$
:::

:::defi[欧拉公式]
$$
e^{j\theta}=cos\theta+j sin\theta=1\angle \theta
$$
:::

### フェーザ変換
$$

$$



---
## フェーザ領域の素子モデル
### フェーザ領域の抵抗
:::caution
$$
V(t)=R i(t),i(t)=\frac{1}{R}V(t)=GV(t)
$$
とする

$$
i(t)=I_m \cos(\omega t+\theta),\qquad \vec{I}=I_m \angle \theta
$$

したがって、
$$
V(t)=R I_m cos(\omega t+\theta)
$$
両辺をフェーザ領域に変換する。
$$
\vec{V}=R I_m\angle \theta=R\vec{I}
$$
因此
$$
Z=\frac{\vec{V}}{\vec{I}}=R
$$
:::



### フェーザ領域のインダクタ
:::caution
$$
V(t)=L\frac{di(t)}{dt},i_L(t)= i_L(0)+\frac{1}{L}\int_0^{\tau} V(\tau)\,d\tau
$$
本章では交流の`定常状態`を扱うため、
$$
i_L(t)=\frac{1}{L}\int_{-\infin}^{\tau} V(\tau)\,d\tau
$$
とする
$$
i(t)=I_m cos(\omega t+\theta),\vec{I}=I_m \angle \theta
$$
したがって、
$$
\begin{aligned}
V(t) &=L\frac{d}{dt}\left[I_m cos(\omega t+\theta)\right]
=-\omega L I_m sin(\omega t+\theta)\\
&=\omega L I_m cos(\omega t+\theta+90^\circ)
\end{aligned}
$$
両辺をフェーザ領域に変換する。
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



### フェーザ領域のコンデンサ
:::caution
$$
i_C(t)=C\frac{dV(t)}{dt},V(t)=V(0)+\frac{1}{C}\int_0^{t}i_C(\tau)\,d\tau
$$
本章では交流の`定常状態`を扱うため、
$$
V_c(t)=\frac{1}{C}\int_{-\infin}^{t}i_C(\tau)\,d\tau
$$
とする
$$
V(t)=V_m cos(\omega t+\theta),\vec{V}=V_m \angle \theta
$$
したがって、
$$
\begin{aligned}
i_C(t)&=C\frac{d}{dt}\left[V_m cos(\omega t+\theta)\right]
=-\omega C V_m sin(\omega t+\theta)\\
&=\omega C V_m cos(\omega t+\theta+90^\circ)
\end{aligned}
$$
両辺をフェーザ領域に変換する。
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

---
## インピーダンス$Z(impedance)$与アドミタンス$Y(admittance)$
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
> フェーザ領域の$R$与$G$、$X$与$B$不再互为倒数!
:::


---
## フェーザ領域の節点電圧法とメッシュ電流法
### フェーザ領域のKCL・KVL
:::tip

正弦波電流
$$
i_K(t)=I_{mK}cos(\omega t+\theta_K)
$$
より $KCL$ ノードから流れ出る電流の代数和は0（流入電流を負とする）。
$$
\sum_{K=1}^n I_K=0
$$
が得られる
$$
\sum_{K=1}^n I_{mK}cos(\omega t+\theta_K) =0
$$
両辺をフェーザ領域に変換する。
$$
\sum_{K=1}^n I_{mK}\angle \theta_K =0+j0
\text{or } \vec{I}_1+\vec{I}_2+...+\vec{I}_n=0
$$
:::

:::tip
正弦波電圧
$$
V_K(t)=V_{mK}cos(\omega t+\phi_K)
$$

より $KVL$ 素子を通る電圧降下の代数和は0（降下を正とする）。
$$
\sum_{K=1}^n V_K=0
$$
が得られる
$$
\sum_{K=1}^n V_{mK}cos(\omega t+\phi_K) =0
$$
両辺をフェーザ領域に変換する。
$$
\sum_{K=1}^n V_{mK}\angle \phi_K =0+j0
\text{or } \vec{V}_1+\vec{V}_2+...+\vec{V}_n=0
$$
:::





---
## フェーザ領域の重ね合わせの原理





---
## フェーザ領域のテブナン・ノートン等価ループ

:::note[電源変換]

:::




---
## 交流定常状態の電力解析
### 交流電力
若
$$
V(t)=V_m cos(\omega t+\theta_v),\vec{V}=V_m \angle{\theta_v}
$$
$$
i(t)=I_m cos(\omega t+\theta_i),\vec{I}=I_m \angle{\theta_i}
$$
一般性を失わず、〜とする
$$
V(t)=V_m cos(\omega t+\theta_v-\theta_i)
$$
$$
i(t)=I_m cos(\omega t)
$$
したがって、

:::defi[瞬时電力 Instantaneous power]
$$
\begin{aligned}
p(t)&=V(t)i(t) \tag{\text{积化和差}}\\
&=V_m cos(\omega t+\theta_v-\theta_i)I_m cos(\omega t) \\
&=\frac{V_m I_m}{2}cos(\theta_v-\theta_i)+\frac{V_m I_m}{2}cos(2\omega t+\theta_v-\theta_i)\\
&=\frac{V_m I_m}{2}cos(\theta_v-\theta_i)+
\frac{V_m I_m}{2}cos(\theta_v-\theta_i)cos(2\omega t)-\frac{V_m I_m}{2}sin(\theta_v-\theta_i)sin(2\omega t)
\end{aligned}
$$
> [!caution]
> 记
> $$
> P=\frac{V_m I_m}{2}cos(\theta_v-\theta_i),Q=\frac{V_m I_m}{2}sin(\theta_v-\theta_i)
> $$  
> したがって、
> $$
> p(t)=P+Pcos(2\omega t)-Qsin(2\omega t)
> $$
:::

:::defi[平均電力 Average power (namely, real power)] 
より
$$
p(t)=P+Pcos(2\omega t)-Qsin(2\omega t)
$$
したがって、平均電力为
$$
\frac{1}{T}\int_{t_0}^{t_0+T}p(\tau)\,d\tau=P=\frac{V_m I_m}{2}cos(\theta_v-\theta_i)
$$
:::

:::defi[虚電力 Reactive power (namely, imaginary power)] 
$$
Q=\frac{V_m I_m}{2}sin(\theta_v-\theta_i)
$$
:::

:::defi[复数電力 Complex power] 
$$
\vec{S}=\vec{V}_{rms}\vec{I}_{rms}^*=P+jQ
$$
:::

:::defi[视在電力 Apparent power] 

$$
|\vec{s}|=\sqrt{P^2+Q^2}
$$
:::

:::defi[電力因数 Power factor]
$$
0\le \frac{P}{|\vec{s}|}=\frac{P}{\sqrt{P^2+Q^2}} \le 1
$$
:::


### 複素電力の保存






### 最大電力伝送

:::defi





負荷$L$のインピーダンスがテブナン等価インピーダンスの複素共役に等しいとき、最大電力が伝送される。
$$
Z_L = Z_{TH}^*
$$
:::



---
## 平衡三相ループ
### 基本概念
:::note[$Y$连接]

:::

:::note[$\Delta$连接]

:::

### $Y$-$Y$ 连接




### $Y$-$\Delta$ 连接





### $\Delta$-$Y$ 连接




### $\Delta$-$\Delta$ 连接

