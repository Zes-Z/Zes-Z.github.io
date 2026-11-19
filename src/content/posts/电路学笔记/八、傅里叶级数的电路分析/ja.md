
## フーリエ級数の目的・形式・物理的意味
### フーリエ級数の目的






### フーリエ級数の3つの形式
#### 標準三角関数展開
:::tip
$$
f(t)=a_0+\sum_{n=1}^{\infty} (a_n\cos(n\omega_0 t)+b_n\sin(n\omega_0 t))
$$
ここで、
$$
a_0=\frac{1}{T}\int_T f(t)\,dt\\
a_n=\frac{2}{T}\int_T f(t)\cos(n\omega_0 t)\,dt\\
b_n=\frac{2}{T}\int_T f(t)\sin(n\omega_0 t)\,dt
$$
:::

#### 合成三角関数展開
:::tip
$$
f(t)=A_0+\sum_{n=1}^{\infty} A_n\cos(n\omega_0 t-\theta_n)

$$
ここで、
$$
A_0=a_0=\frac{1}{T}\int_T f(t)\,dt\\
A_n=\sqrt{a_n^2+b_n^2}\\
\theta_n=\tan^{-1}\frac{b_n}{a_n}
$$
:::


#### 指数関数展開
:::tip
より欧拉公式
$$
\cos(n\omega_0t)=\frac{e^{jn\omega_0t}+e^{-jn\omega_0t}}{2}
$$
$$
\sin(n\omega_0t)=\frac{e^{jn\omega_0t}-e^{-jn\omega_0t}}{2j}
$$
標準三角関数展開に代入する。
$$
f(t)=a_0+\sum_{n=1}^{\infty}(a_n\cos(n\omega_0t)+b_n\sin(n\omega_0t))
$$
得
$$
f(t)=a_0+\sum_{n=1}^{\infty}\left[a_n\frac{e^{jn\omega_0t}+e^{-jn\omega_0t}}{2}+b_n\frac{e^{jn\omega_0t}-e^{-jn\omega_0t}}{2j}\right]
$$
整理すると、
$$
f(t)=a_0+\sum_{n=1}^{\infty}\left[\frac{a_n-jb_n}{2}e^{jn\omega_0t}+\frac{a_n+jb_n}{2}e^{-jn\omega_0t}\right]
$$
とおく
$$
C_0=a_0 \qquad C_n=\frac{a_n-jb_n}{2} \qquad C_{-n}=\frac{a_n+jb_n}{2}
$$
したがって、
$$
f(t)=\sum_{n=-\infty}^{\infty}C_ne^{jn\omega_0t}
$$
ここで、
$$
C_n=\frac{1}{T}\int_Tf(t)e^{-jn\omega_0t}\,dt
$$
:::

---
## 周期関数の対称性を利用したフーリエ級数の計算
### 偶対称





### 奇対称






### 半波対称






### 4分の1波対称





---
## ループ解析におけるフーリエ級数の応用
### ループ解析における合成三角関数形式




### 周期電源を用いたループ解析





---
## 周期電源の電力計算

### フーリエ級数による平均電力の計算

とする電圧和電流的傅里叶级数分别为
$$
v(t)=V_{DC}+\sum_{m=1}^{\infty}V_m\cos(m\omega_0t-\theta_{Vm})
$$

$$
i(t)=I_{DC}+\sum_{n=1}^{\infty}I_n\cos(n\omega_0t-\theta_{In})
$$

平均電力定义为
$$
P=\frac{1}{T}\int_{t_0}^{t_0+T}v(t)i(t)\,dt
$$

将 v(t) 和 i(t) 代入：

$$
P=\frac{1}{T}\int_{t_0}^{t_0+T}
\left[V_{DC}+\sum_{m=1}^{\infty}V_m\cos(m\omega_0t-\theta_{Vm})\right]\left[I_{DC}+\sum_{n=1}^{\infty}I_n\cos(n\omega_0t-\theta_{In})\right]
$$

展开：
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

より于
:::note[三角函数的正交性]
在一个完整周期 \(T\) 内，三角函数满足以下正交关系：

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

ここで、
$$
\int_{t_0}^{t_0+T}cos(2n\omega_0t-\theta_{Vn}-\theta_{In})\,dt=0
$$

因此得到
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

这就是含有直流分量和各次谐波的周期信号的平均電力公式。



### 実効値と等価直流値による平均電力の計算

