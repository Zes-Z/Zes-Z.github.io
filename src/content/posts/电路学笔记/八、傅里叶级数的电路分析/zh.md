
## 傅里叶级数的目的、形式与物理意义
### 傅里叶级数的目的






### 傅里叶级数的三种形式
#### 标准三角展开式
:::tip
$$
f(t)=a_0+\sum_{n=1}^{\infty} (a_n\cos(n\omega_0 t)+b_n\sin(n\omega_0 t))
$$
其中
$$
a_0=\frac{1}{T}\int_T f(t)\,dt，
a_n=\frac{2}{T}\int_T f(t)\cos(n\omega_0 t)\,dt，
b_n=\frac{2}{T}\int_T f(t)\sin(n\omega_0 t)\,dt
$$
:::

#### 合并三角展开式
:::tip
$$
f(t)=A_0+\sum_{n=1}^{\infty} A_n\cos(n\omega_0 t-\theta_n)

$$
其中
$$
A_0=a_0=\frac{1}{T}\int_T f(t)\,dt，
A_n=\sqrt{a_n^2+b_n^2}，
\theta_n=\tan^{-1}\frac{b_n}{a_n}
$$
:::


#### 指数展开式
:::tip
由欧拉公式
$$
\cos(n\omega_0t)=\frac{e^{jn\omega_0t}+e^{-jn\omega_0t}}{2}
$$
$$
\sin(n\omega_0t)=\frac{e^{jn\omega_0t}-e^{-jn\omega_0t}}{2j}
$$
代入标准三角展开式
$$
f(t)=a_0+\sum_{n=1}^{\infty}(a_n\cos(n\omega_0t)+b_n\sin(n\omega_0t))
$$
得
$$
f(t)=a_0+\sum_{n=1}^{\infty}\left[a_n\frac{e^{jn\omega_0t}+e^{-jn\omega_0t}}{2}+b_n\frac{e^{jn\omega_0t}-e^{-jn\omega_0t}}{2j}\right]
$$
整理得
$$
f(t)=a_0+\sum_{n=1}^{\infty}\left[\frac{a_n-jb_n}{2}e^{jn\omega_0t}+\frac{a_n+jb_n}{2}e^{-jn\omega_0t}\right]
$$
令
$$
C_0=a_0 \qquad C_n=\frac{a_n-jb_n}{2} \qquad C_{-n}=\frac{a_n+jb_n}{2}
$$
于是
$$
f(t)=\sum_{n=-\infty}^{\infty}C_ne^{jn\omega_0t}
$$
其中
$$
C_n=\frac{1}{T}\int_Tf(t)e^{-jn\omega_0t}\,dt
$$
:::

---
## 利用周期函数的对称性计算傅里叶级数
### 偶对称





### 奇对称






### 半波对称






### 四分之一波对称





---
## 傅里叶级数在电路分析中的应用
### 电路分析中的合并三角形式




### 周期性电源的电路解题





---
## 周期性电源的功率计算

### 傅里叶级数计算平均功率

设电压和电流的傅里叶级数分别为
$$
v(t)=V_{DC}+\sum_{m=1}^{\infty}V_m\cos(m\omega_0t-\theta_{Vm})
$$

$$
i(t)=I_{DC}+\sum_{n=1}^{\infty}I_n\cos(n\omega_0t-\theta_{In})
$$

平均功率定义为
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

由于
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

其中
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

这就是含有直流分量和各次谐波的周期信号的平均功率公式。



### 方均根值与等效直流电计算平均功率

