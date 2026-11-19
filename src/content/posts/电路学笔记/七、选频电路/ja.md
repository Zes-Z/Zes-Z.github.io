
## 受動フィルタの基礎概念と分類

### 通過帯域・阻止帯域・遮断周波数




---
## ローパスフィルタ (LPF)
### RL电路
> [!caution/输出取RL电路中的抵抗R两端]
> $$
> H(s)=\frac{R}{R+SL}=\frac{\frac{R}{L}}{\frac{R}{L}+S}
> $$
> $$
> ∣H(j\omega)∣=\frac{\frac{R}{L}}{\sqrt{(\frac{R}{L})^2+\omega^2}},\theta(j\omega)=-tan^{-1}(\frac{\omega L}{R})
> $$

### RC电路
> [!caution/输出取RC电路中的コンデンサC两端]
> $$
> H(s)=\frac{\frac{1}{SC}}{R+\frac{1}{SC}}=\frac{\frac{1}{RC}}{S+\frac{1}{RC}}
> $$
> $$
> ∣H(j\omega)∣=\frac{\frac{1}{RC}}{\sqrt{(\frac{1}{RC})^2+\omega^2}},\theta(j\omega)=-tan^{-1}(\omega RC)
> $$


---
## ハイパスフィルタ (HPF)
### RL电路
> [!caution/输出取RC电路中的抵抗R两端]
> $$
> H(s)=\frac{R}{R+\frac{1}{SC}}=\frac{S}{S+\frac{1}{RC}}
> $$
> $$
> ∣H(j\omega)∣=\frac{\omega}{\sqrt{(\frac{1}{RC})^2+\omega^2}},\theta(j\omega)=90^\circ-tan^{-1}(\omega RC)
> $$

### RC电路
> [!caution/输出取RL电路中的インダクタL两端]
> $$
> H(s)=\frac{SL}{R+SL}=\frac{S}{\frac{R}{L}+S}
> $$
> $$
> ∣H(j\omega)∣=\frac{\omega}{\sqrt{(\frac{R}{L})^2+\omega^2}},\theta(j\omega)=90^\circ-tan^{-1}(\frac{\omega L}{R})
> $$


---
## バンドパスフィルタ (BPF)
### 中心周波数／共振周波数


### 遮断周波数



### 帯域幅



### Q値


### $R-L-C$直列ループ
> [!caution/输出取R-L-C直列ループ中的抵抗R两端]
> $$
> H(s)=\frac{R}{R+\frac{1}{SC}}=\frac{S}{S+\frac{1}{RC}}
> $$
> $$
> ∣H(j\omega)∣=\frac{\omega}{\sqrt{(\frac{1}{RC})^2+\omega^2}},\theta(j\omega)=90^\circ-tan^{-1}(\omega RC)
> $$


### $R\parallel L-C$並列ループ
> [!caution/输出取R||L-C並列ループ中的并联LC两端]
> $$
> H(s)=\frac{R}{R+\frac{1}{SC}}=\frac{S}{S+\frac{1}{RC}}
> $$
> $$
> ∣H(j\omega)∣=\frac{\omega}{\sqrt{(\frac{1}{RC})^2+\omega^2}},\theta(j\omega)=90^\circ-tan^{-1}(\omega RC)
> $$


---
## バンドストップフィルタ (BRF)
### 中心频率


### 遮断周波数



### 帯域幅



### Q値


### $R-L-C$直列ループ
> [!caution/输出取R-L-C电路中的串联L-C两端]
> $$
> H(s)=\frac{}{}
> $$
> $$
> ∣H(j\omega)∣=\frac{}{},\theta(j\omega)=
> $$


### $R\parallel L-C$並列ループ
> [!caution/输出取R||L-C並列ループ中的抵抗R两端]
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

步骤一：将电路转换为 $s$ 域，计算出 $H(s)$，并带入 $s=j\omega$

$$
H(s)\ \longrightarrow\ H(j\omega)
$$

步骤二：求出 $|H(j\omega)|$ 及其最大值 $H_{max}$

$$
|H(j\omega)|_{max}=H_{max}
$$

步骤三：とおく $|H(j\omega)|=\frac{1}{\sqrt{2}}H_{max}$，求出上下带宽频率

$$
|H(j\omega)|=\frac{1}{\sqrt{2}}H_{max}
$$
:::