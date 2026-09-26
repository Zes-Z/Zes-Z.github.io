
## 被动滤波器的基础概念与分类

### 通带、止带、截止频率




---
## 低通滤波器 (LPF)
### RL电路
> [!caution/输出取RL电路中的电阻R两端]
> $$
> H(s)=\frac{R}{R+SL}=\frac{\frac{R}{L}}{\frac{R}{L}+S}
> $$
> $$
> ∣H(j\omega)∣=\frac{\frac{R}{L}}{\sqrt{(\frac{R}{L})^2+\omega^2}}，\theta(j\omega)=-tan^{-1}(\frac{\omega L}{R})
> $$

### RC电路
> [!caution/输出取RC电路中的电容C两端]
> $$
> H(s)=\frac{\frac{1}{SC}}{R+\frac{1}{SC}}=\frac{\frac{1}{RC}}{S+\frac{1}{RC}}
> $$
> $$
> ∣H(j\omega)∣=\frac{\frac{1}{RC}}{\sqrt{(\frac{1}{RC})^2+\omega^2}}，\theta(j\omega)=-tan^{-1}(\omega RC)
> $$


---
## 高通滤波器 (HPF)
### RL电路
> [!caution/输出取RC电路中的电阻R两端]
> $$
> H(s)=\frac{R}{R+\frac{1}{SC}}=\frac{S}{S+\frac{1}{RC}}
> $$
> $$
> ∣H(j\omega)∣=\frac{\omega}{\sqrt{(\frac{1}{RC})^2+\omega^2}}，\theta(j\omega)=90^\circ-tan^{-1}(\omega RC)
> $$

### RC电路
> [!caution/输出取RL电路中的电感L两端]
> $$
> H(s)=\frac{SL}{R+SL}=\frac{S}{\frac{R}{L}+S}
> $$
> $$
> ∣H(j\omega)∣=\frac{\omega}{\sqrt{(\frac{R}{L})^2+\omega^2}}，\theta(j\omega)=90^\circ-tan^{-1}(\frac{\omega L}{R})
> $$


---
## 带通滤波器 (BPF)
### 中心/谐振频率


### 截止频率



### 频宽



### 品质因子


### $R-L-C$串联电路
> [!caution/输出取R-L-C串联电路中的电阻R两端]
> $$
> H(s)=\frac{R}{R+\frac{1}{SC}}=\frac{S}{S+\frac{1}{RC}}
> $$
> $$
> ∣H(j\omega)∣=\frac{\omega}{\sqrt{(\frac{1}{RC})^2+\omega^2}}，\theta(j\omega)=90^\circ-tan^{-1}(\omega RC)
> $$


### $R\parallel L-C$并联电路
> [!caution/输出取R||L-C并联电路中的并联LC两端]
> $$
> H(s)=\frac{R}{R+\frac{1}{SC}}=\frac{S}{S+\frac{1}{RC}}
> $$
> $$
> ∣H(j\omega)∣=\frac{\omega}{\sqrt{(\frac{1}{RC})^2+\omega^2}}，\theta(j\omega)=90^\circ-tan^{-1}(\omega RC)
> $$


---
## 带阻滤波器 (BRF)
### 中心频率


### 截止频率



### 频宽



### 品质因子


### $R-L-C$串联电路
> [!caution/输出取R-L-C电路中的串联L-C两端]
> $$
> H(s)=\frac{}{}
> $$
> $$
> ∣H(j\omega)∣=\frac{}{}，\theta(j\omega)=
> $$


### $R\parallel L-C$并联电路
> [!caution/输出取R||L-C并联电路中的电阻R两端]
> $$
> H(s)=\frac{}{}
> $$
> $$
> ∣H(j\omega)∣=\frac{}{}，\theta(j\omega)=
> $$


---
## $SOP$
:::note
<!-- 若
$$
V_i=Acos(\omega t+\phi) =A\angle \phi
$$ -->

步骤一  
$$
将电路转换为s域，计算出H(s)，并带入s=j\omega
$$

步骤二
$$
求出|H(j\omega)|，及其最大值H_{max}
$$

步骤三
$$
令|H(j\omega)|=\frac{1}{\sqrt{2}}H_{max}，求出上下带宽频率
$$
:::