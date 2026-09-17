


## 电容器与电感器

### 

:::tip 电容
由
$$
i(t) = C \frac{dV(t)}{dt}
$$
可得
$$
V(t) = \int_{-\infty}^{\tau} \frac{i({\tau})}{C}\,d{\tau}
=V(0)+\frac1{C}\int_0^{\tau} i({\tau})\,d{\tau}
$$
> [!caution]
> * 电容器在直流非时变时，表现像开路
> * 电容器的电压必定连续
:::

:::tip 电感
由
$$
V(t) = L \frac{di(t)}{dt}
$$
可得
$$
i(t) = \int_{-\infty}^{\tau} \frac{V({\tau})}{L}\,d{\tau}
=i(0)+\frac1{L}\int_0^{\tau} V({\tau})\,d{\tau}
$$
> [!caution]
> * 电感器在直流非时变时，表现像短路
> * 电感器的电流必定连续
:::


### 电容器与电感器的串并联

#### 电容器并联电容器



#### 电容器串联电容器



#### 电感器串联电感器



#### 电感器并联电感器