
## Fundamentals and Types of Passive Filters

### Passband, Stopband, and Cutoff Frequency




---
## Low-Pass Filter (LPF)
### RL电路
> [!caution/输出取RL电路中的ResistorR两端]
> $$
> H(s)=\frac{R}{R+SL}=\frac{\frac{R}{L}}{\frac{R}{L}+S}
> $$
> $$
> ∣H(j\omega)∣=\frac{\frac{R}{L}}{\sqrt{(\frac{R}{L})^2+\omega^2}},\theta(j\omega)=-tan^{-1}(\frac{\omega L}{R})
> $$

### RC电路
> [!caution/输出取RC电路中的CapacitorC两端]
> $$
> H(s)=\frac{\frac{1}{SC}}{R+\frac{1}{SC}}=\frac{\frac{1}{RC}}{S+\frac{1}{RC}}
> $$
> $$
> ∣H(j\omega)∣=\frac{\frac{1}{RC}}{\sqrt{(\frac{1}{RC})^2+\omega^2}},\theta(j\omega)=-tan^{-1}(\omega RC)
> $$


---
## High-Pass Filter (HPF)
### RL电路
> [!caution/输出取RC电路中的ResistorR两端]
> $$
> H(s)=\frac{R}{R+\frac{1}{SC}}=\frac{S}{S+\frac{1}{RC}}
> $$
> $$
> ∣H(j\omega)∣=\frac{\omega}{\sqrt{(\frac{1}{RC})^2+\omega^2}},\theta(j\omega)=90^\circ-tan^{-1}(\omega RC)
> $$

### RC电路
> [!caution/输出取RL电路中的InductorL两端]
> $$
> H(s)=\frac{SL}{R+SL}=\frac{S}{\frac{R}{L}+S}
> $$
> $$
> ∣H(j\omega)∣=\frac{\omega}{\sqrt{(\frac{R}{L})^2+\omega^2}},\theta(j\omega)=90^\circ-tan^{-1}(\frac{\omega L}{R})
> $$


---
## Band-Pass Filter (BPF)
### Center / Resonant Frequency


### Cutoff Frequency



### Bandwidth



### Quality Factor


### $R-L-C$Series Circuit
> [!caution/输出取R-L-CSeries Circuit中的ResistorR两端]
> $$
> H(s)=\frac{R}{R+\frac{1}{SC}}=\frac{S}{S+\frac{1}{RC}}
> $$
> $$
> ∣H(j\omega)∣=\frac{\omega}{\sqrt{(\frac{1}{RC})^2+\omega^2}},\theta(j\omega)=90^\circ-tan^{-1}(\omega RC)
> $$


### $R\parallel L-C$Parallel Circuit
> [!caution/输出取R||L-CParallel Circuit中的并联LC两端]
> $$
> H(s)=\frac{R}{R+\frac{1}{SC}}=\frac{S}{S+\frac{1}{RC}}
> $$
> $$
> ∣H(j\omega)∣=\frac{\omega}{\sqrt{(\frac{1}{RC})^2+\omega^2}},\theta(j\omega)=90^\circ-tan^{-1}(\omega RC)
> $$


---
## Band-Stop Filter (BRF)
### 中心频率


### Cutoff Frequency



### Bandwidth



### Quality Factor


### $R-L-C$Series Circuit
> [!caution/输出取R-L-C电路中的串联L-C两端]
> $$
> H(s)=\frac{}{}
> $$
> $$
> ∣H(j\omega)∣=\frac{}{},\theta(j\omega)=
> $$


### $R\parallel L-C$Parallel Circuit
> [!caution/输出取R||L-CParallel Circuit中的ResistorR两端]
> $$
> H(s)=\frac{}{}
> $$
> $$
> ∣H(j\omega)∣=\frac{}{},\theta(j\omega)=
> $$


---
## $SOP$
:::note
<!-- 若
$$
V_i=Acos(\omega t+\phi) =A\angle \phi
$$ -->

Step 1: Transform the circuit into the $s$-domain, find $H(s)$, and substitute $s=j\omega$.

$$
H(s)\ \longrightarrow\ H(j\omega)
$$

Step 2: Find $|H(j\omega)|$ and its maximum value $H_{max}$.

$$
|H(j\omega)|_{max}=H_{max}
$$

步骤三：Let $|H(j\omega)|=\frac{1}{\sqrt{2}}H_{max}$，Find出上下带宽频率

$$
|H(j\omega)|=\frac{1}{\sqrt{2}}H_{max}
$$
:::