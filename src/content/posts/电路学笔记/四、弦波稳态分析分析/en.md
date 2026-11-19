## Phasor Analysis
### Trigonometric Prerequisites 
:::tip[正弦、余弦互化与叠加]
From
$$

$$
we obtain
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
where 
$$
C=\sqrt{A^2+B^2} ,\theta=\tan^{-1}\frac{B}{A}
$$
:::

:::defi[欧拉公式]
$$
e^{j\theta}=cos\theta+j sin\theta=1\angle \theta
$$
:::

### Phasor Transformation
$$

$$



---
## Component Models in the Phasor Domain
### in the Phasor Domain: Resistor
:::caution
$$
V(t)=R i(t),i(t)=\frac{1}{R}V(t)=GV(t)
$$
Let

$$
i(t)=I_m \cos(\omega t+\theta),\qquad \vec{I}=I_m \angle \theta
$$

Then,
$$
V(t)=R I_m cos(\omega t+\theta)
$$
Convert both sides to the phasor domain.
$$
\vec{V}=R I_m\angle \theta=R\vec{I}
$$
因此
$$
Z=\frac{\vec{V}}{\vec{I}}=R
$$
:::



### in the Phasor Domain: Inductor
:::caution
$$
V(t)=L\frac{di(t)}{dt},i_L(t)= i_L(0)+\frac{1}{L}\int_0^{\tau} V(\tau)\,d\tau
$$
This chapter focuses on AC `steady-state` analysis, so:
$$
i_L(t)=\frac{1}{L}\int_{-\infin}^{\tau} V(\tau)\,d\tau
$$
Let
$$
i(t)=I_m cos(\omega t+\theta),\vec{I}=I_m \angle \theta
$$
Then,
$$
\begin{aligned}
V(t) &=L\frac{d}{dt}\left[I_m cos(\omega t+\theta)\right]
=-\omega L I_m sin(\omega t+\theta)\\
&=\omega L I_m cos(\omega t+\theta+90^\circ)
\end{aligned}
$$
Convert both sides to the phasor domain.
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



### in the Phasor Domain: Capacitor
:::caution
$$
i_C(t)=C\frac{dV(t)}{dt},V(t)=V(0)+\frac{1}{C}\int_0^{t}i_C(\tau)\,d\tau
$$
This chapter focuses on AC `steady-state` analysis, so:
$$
V_c(t)=\frac{1}{C}\int_{-\infin}^{t}i_C(\tau)\,d\tau
$$
Let
$$
V(t)=V_m cos(\omega t+\theta),\vec{V}=V_m \angle \theta
$$
Then,
$$
\begin{aligned}
i_C(t)&=C\frac{d}{dt}\left[V_m cos(\omega t+\theta)\right]
=-\omega C V_m sin(\omega t+\theta)\\
&=\omega C V_m cos(\omega t+\theta+90^\circ)
\end{aligned}
$$
Convert both sides to the phasor domain.
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
## Impedance$Z(impedance)$与Admittance$Y(admittance)$
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
> in the Phasor Domain: $R$与$G$、$X$与$B$不再互为倒数!
:::


---
## Nodal-Voltage and Mesh-Current Methods in the Phasor Domain
### KCL and KVL in the Phasor Domain
:::tip

Sinusoidal current
$$
i_K(t)=I_{mK}cos(\omega t+\theta_K)
$$
By $KCL$, the algebraic sum of currents leaving a node is zero (currents entering are negative).
$$
\sum_{K=1}^n I_K=0
$$
we obtain
$$
\sum_{K=1}^n I_{mK}cos(\omega t+\theta_K) =0
$$
Convert both sides to the phasor domain.
$$
\sum_{K=1}^n I_{mK}\angle \theta_K =0+j0
\text{or } \vec{I}_1+\vec{I}_2+...+\vec{I}_n=0
$$
:::

:::tip
Sinusoidal voltage
$$
V_K(t)=V_{mK}cos(\omega t+\phi_K)
$$

By $KVL$, the algebraic sum of voltage drops around a loop is zero (taking drops as positive).
$$
\sum_{K=1}^n V_K=0
$$
we obtain
$$
\sum_{K=1}^n V_{mK}cos(\omega t+\phi_K) =0
$$
Convert both sides to the phasor domain.
$$
\sum_{K=1}^n V_{mK}\angle \phi_K =0+j0
\text{or } \vec{V}_1+\vec{V}_2+...+\vec{V}_n=0
$$
:::





---
## Superposition in the Phasor Domain





---
## Thevenin-Norton Equivalent Circuits in the Phasor Domain

:::note[Source Transformations]

:::




---
## AC Steady-State Power Analysis
### AC Power
若
$$
V(t)=V_m cos(\omega t+\theta_v),\vec{V}=V_m \angle{\theta_v}
$$
$$
i(t)=I_m cos(\omega t+\theta_i),\vec{I}=I_m \angle{\theta_i}
$$
Without loss of generality, let
$$
V(t)=V_m cos(\omega t+\theta_v-\theta_i)
$$
$$
i(t)=I_m cos(\omega t)
$$
Then,

:::defi[瞬时Power Instantaneous power]
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
> Then,
> $$
> p(t)=P+Pcos(2\omega t)-Qsin(2\omega t)
> $$
:::

:::defi[平均Power Average power (namely, real power)] 
From
$$
p(t)=P+Pcos(2\omega t)-Qsin(2\omega t)
$$
Then,平均Power为
$$
\frac{1}{T}\int_{t_0}^{t_0+T}p(\tau)\,d\tau=P=\frac{V_m I_m}{2}cos(\theta_v-\theta_i)
$$
:::

:::defi[虚Power Reactive power (namely, imaginary power)] 
$$
Q=\frac{V_m I_m}{2}sin(\theta_v-\theta_i)
$$
:::

:::defi[复数Power Complex power] 
$$
\vec{S}=\vec{V}_{rms}\vec{I}_{rms}^*=P+jQ
$$
:::

:::defi[视在Power Apparent power] 

$$
|\vec{s}|=\sqrt{P^2+Q^2}
$$
:::

:::defi[Power因数 Power factor]
$$
0\le \frac{P}{|\vec{s}|}=\frac{P}{\sqrt{P^2+Q^2}} \le 1
$$
:::


### Conservation of Complex Power






### Maximum Power Transfer

:::defi





Maximum power is transferred when the load impedance is the complex conjugate of the Thevenin equivalent impedance.
$$
Z_L = Z_{TH}^*
$$
:::



---
## Balanced Three-Phase Circuits
### Basic Concepts
:::note[$Y$连接]

:::

:::note[$\Delta$连接]

:::

### $Y$-$Y$ 连接




### $Y$-$\Delta$ 连接





### $\Delta$-$Y$ 连接




### $\Delta$-$\Delta$ 连接

