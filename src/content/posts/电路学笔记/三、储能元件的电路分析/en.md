


## Capacitors and Inductors

### 

:::tip[Capacitor]
From
$$
i(t) = C \frac{dV(t)}{dt}
$$
we obtain
$$
V(t) = \int_{-\infty}^{t} \frac{i({\tau})}{C}\,d{\tau}
=V(0)+\frac1{C}\int_0^{t} i({\tau})\,d{\tau}
$$
> [!caution]
> * Capacitor器在直流非时变(直流稳态)时，表现像开路
> * Capacitor器的Voltage必定连续
:::

:::tip[Inductor]
From
$$
V(t) = L \frac{di(t)}{dt}
$$
we obtain
$$
i(t) = \int_{-\infty}^{t} \frac{V({\tau})}{L}\,d{\tau}
=i(0)+\frac1{L}\int_0^{t} V({\tau})\,d{\tau}
$$
> [!caution]
> * Inductor器在直流非时变(直流稳态)时，表现像短路
> * Inductor器的Current必定连续
:::


### Series and Parallel Combinations of Capacitors and Inductors

#### Capacitors in Parallel



#### Capacitors in Series



#### Inductors in Series



#### Inductors in Parallel


---
## Systematic Solutions for RC and RL Circuits

> [!tip]
> * RC电路尽量用Nodal-Voltage Method
> * RL电路尽量用Mesh-Current Method

### RC电路
:::note[SOP]
1. For $t\le 0^-$,
Since a `capacitor` behaves like an `open circuit` under DC steady-state conditions,  
find the capacitor voltage; this is the initial condition.
1. For $t\ge 0^-$, to find $V(t)$,  
use nodal analysis and $i(t) = C \frac{dV(t)}{dt}$ to write the differential equation.
1. Solve the differential equation and substitute the initial value from step 1 to find the constant.

:::

### RL电路
:::note[SOP]
1. For $t\le 0^-$,
Since an `inductor` behaves like a `short circuit` under DC steady-state conditions,  
find the inductor current; this is the initial condition.
1. For $t\ge 0^-$, to find $i(t)$,  
use mesh-current analysis and $V(t) = L \frac{di(t)}{dt}$ to write the differential equation.
1. Solve the differential equation and substitute the initial value from step 1 to find the constant.
:::


---

## Systematic Solutions for RLC Circuits
:::note[SOP]
1. For $t\le 0^-$,根据：  
`Inductor器`在直流非时变(直流稳态)时，`表现像短路`，`Inductor器`在直流非时变(直流稳态)时，`表现像短路`，    
Find出Capacitor器上的Voltage、Inductor器上的Current即为初始状态
2. $t\ge 0^-$ 时，为Find$i_n(t)$、$V_n(t)$，  
use nodal-voltage or mesh-current analysis and the relevant equations to write the differential equation.  
* Mesh-Current Method
$$
V_L(t) = L \frac{di(t)}{dt}
$$  
$$
\begin{aligned}
V_C(t) 
&= \int_{-\infty}^{t} \frac{i({\tau})}{C}\,d{\tau}\\
&=V_C(0)+\frac1{C}\int_0^{t} i({\tau})\,d{\tau}
\end{aligned}
$$

* Nodal-Voltage Method
$$
i_C(t) = C \frac{dV(t)}{dt}
$$
$$
\begin{aligned}
i_L(t)
&= \int_{-\infty}^{t} \frac{V(\tau)}{L}\,d\tau \\
&= i_L(0)+\frac{1}{L}\int_0^{t} V(\tau)\,d\tau
\end{aligned}
$$

3. Find解微分方程，将1. 中的初始值带入，Find出常数
> [!caution]
> 初始值 $i_L(0)$ 或 $V_C(0)$ 不可直接带入微分方程，需判断：
> * Inductor器是否处于重合电路，  
> 此时需根据初始条件$i_L(0)=a=i_1-i_2$，反解所需$i_n$作为微分方程的初始值
> * Capacitor器的压降方向，  
> 若初始电路条件下Find出的$V_C(0)$压降方向与微分方程中预Let的LoopCurrent方向不一致，  
> Then,需将微分方程中的$V_C(0)$修正为$-V_C(0)$
:::
