
## Purpose, Forms, and Physical Meaning of Fourier Series
### Purpose of Fourier Series






### Three Forms of Fourier Series
#### Standard Trigonometric Expansion
:::tip
$$
f(t)=a_0+\sum_{n=1}^{\infty} (a_n\cos(n\omega_0 t)+b_n\sin(n\omega_0 t))
$$
where
$$
a_0=\frac{1}{T}\int_T f(t)\,dt\\
a_n=\frac{2}{T}\int_T f(t)\cos(n\omega_0 t)\,dt\\
b_n=\frac{2}{T}\int_T f(t)\sin(n\omega_0 t)\,dt
$$
:::

#### Combined Trigonometric Expansion
:::tip
$$
f(t)=A_0+\sum_{n=1}^{\infty} A_n\cos(n\omega_0 t-\theta_n)

$$
where
$$
A_0=a_0=\frac{1}{T}\int_T f(t)\,dt\\
A_n=\sqrt{a_n^2+b_n^2}\\
\theta_n=\tan^{-1}\frac{b_n}{a_n}
$$
:::


#### Exponential Expansion
:::tip
From欧拉公式
$$
\cos(n\omega_0t)=\frac{e^{jn\omega_0t}+e^{-jn\omega_0t}}{2}
$$
$$
\sin(n\omega_0t)=\frac{e^{jn\omega_0t}-e^{-jn\omega_0t}}{2j}
$$
Substitute into the standard trigonometric expansion.
$$
f(t)=a_0+\sum_{n=1}^{\infty}(a_n\cos(n\omega_0t)+b_n\sin(n\omega_0t))
$$
得
$$
f(t)=a_0+\sum_{n=1}^{\infty}\left[a_n\frac{e^{jn\omega_0t}+e^{-jn\omega_0t}}{2}+b_n\frac{e^{jn\omega_0t}-e^{-jn\omega_0t}}{2j}\right]
$$
Rearranging gives:
$$
f(t)=a_0+\sum_{n=1}^{\infty}\left[\frac{a_n-jb_n}{2}e^{jn\omega_0t}+\frac{a_n+jb_n}{2}e^{-jn\omega_0t}\right]
$$
Let
$$
C_0=a_0 \qquad C_n=\frac{a_n-jb_n}{2} \qquad C_{-n}=\frac{a_n+jb_n}{2}
$$
Thus,
$$
f(t)=\sum_{n=-\infty}^{\infty}C_ne^{jn\omega_0t}
$$
where
$$
C_n=\frac{1}{T}\int_Tf(t)e^{-jn\omega_0t}\,dt
$$
:::

---
## Using Periodic-Signal Symmetry to Compute Fourier Series
### Even Symmetry





### Odd Symmetry






### Half-Wave Symmetry






### Quarter-Wave Symmetry





---
## Applications of Fourier Series in Circuit Analysis
### Combined Trigonometric Form in Circuit Analysis




### Circuit Analysis with Periodic Sources





---
## Power Calculation for Periodic Sources

### Calculating Average Power with Fourier Series

LetVoltage和Current的傅里叶级数分别为
$$
v(t)=V_{DC}+\sum_{m=1}^{\infty}V_m\cos(m\omega_0t-\theta_{Vm})
$$

$$
i(t)=I_{DC}+\sum_{n=1}^{\infty}I_n\cos(n\omega_0t-\theta_{In})
$$

The average power is defined as
$$
P=\frac{1}{T}\int_{t_0}^{t_0+T}v(t)i(t)\,dt
$$

Substitute v(t) and i(t):

$$
P=\frac{1}{T}\int_{t_0}^{t_0+T}
\left[V_{DC}+\sum_{m=1}^{\infty}V_m\cos(m\omega_0t-\theta_{Vm})\right]\left[I_{DC}+\sum_{n=1}^{\infty}I_n\cos(n\omega_0t-\theta_{In})\right]
$$

Expand:
$$
\begin{aligned}
P={}&\frac{1}{T}\int_{t_0}^{t_0+T}
\Bigg[
V_{DC}I_{DC}+\sum_{m=1}^{\infty}\sum_{n=1}^{\infty}
V_mI_n
\cos(m\omega_0t-\theta_{Vm})
\cos(n\omega_0t-\theta_{In})\\
&+V_{DC}\sum_{n=1}^{\infty}I_n\cos(n\omega_0t-\theta_{In})
+I_{DC}\sum_{n=1}^{\infty}V_n\cos(n\omega_0t-\theta_{Vn})
\Bigg]dt
\end{aligned}
$$

From于
:::note[三角函数的正交性]
Over one full period \(T\), trigonometric functions satisfy the following orthogonality relations:

$$
\int_{t_0}^{t_0+T}\sin(m\omega_0t)\,dt=0
\qquad\text{for all }m
$$

$$
\int_{t_0}^{t_0+T}\cos(m\omega_0t)\,dt=0
\qquad\text{for all }m
$$

$$
\int_{t_0}^{t_0+T}
\cos(m\omega_0t)\sin(n\omega_0t)\,dt=0
\qquad\text{for all }m,n
$$

$$
\int_{t_0}^{t_0+T}
\sin(m\omega_0t)\sin(n\omega_0t)\,dt
=
\begin{cases}
0,&m\ne n\\
\dfrac{T}{2},&m=n
\end{cases}
$$

$$
\int_{t_0}^{t_0+T}
\cos(m\omega_0t)\cos(n\omega_0t)\,dt
=
\begin{cases}
0,&m\ne n\\
\dfrac{T}{2},&m=n
\end{cases}
$$
:::

因此
$$

P=\frac{1}{T}\int_{t_0}^{t_0+T}
\Bigg[
V_{DC}I_{DC}+\sum_{n=1}^{\infty}
V_nI_n
\cos(n\omega_0t-\theta_{Vn})
\cos(n\omega_0t-\theta_{In})
\Bigg]dt
$$

根据积化和差公式
$$
\begin{aligned}
P
={}&V_{DC}I_{DC}
+\frac{1}{T}\sum_{n=1}^{\infty}
\frac{V_n I_n}{2}
\int_{t_0}^{t_0+T}
\Big[
cos(\theta_{Vn}-\theta_{In})+cos(2n\omega_0t-\theta_{Vn}-\theta_{In})
\Big]dt
\end{aligned}
$$

where
$$
\int_{t_0}^{t_0+T}cos(2n\omega_0t-\theta_{Vn}-\theta_{In})\,dt=0
$$

Therefore, we obtain
$$
\begin{aligned}
P&=V_{DC}I_{DC}+\frac{1}{T}\sum_{n=1}^{\infty}\frac{V_n I_n}{2}\int_{t_0}^{t_0+T}cos(\theta_{Vn}-\theta_{In})\,dt\\
&=V_{DC}I_{DC}+\sum_{n=1}^{\infty}\frac{V_n I_n}{2}cos(\theta_{Vn}-\theta_{In})
\end{aligned}
$$

$$
\boxed{
P
=
V_{DC}I_{DC}
+
\frac{1}{2}
\sum_{n=1}^{\infty}
V_nI_n
\cos(\theta_{Vn}-\theta_{In})
}
$$

This is the average-power formula for a periodic signal containing a DC component and harmonics.



### Calculating Average Power from RMS and Equivalent DC Values

