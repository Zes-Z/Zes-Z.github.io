<!-- ---
title: "基本电路观念"
description: ""
pubDate: "2026-09-14"
category: "Math & Coding"
tag: ["电路"]
postImage:
homepined: false
pinedOrder: 0
draft: false
--- -->

## 电路变量的定义
### 电流
> [!definition,电流是每单位时间通过的电荷量]
> :::tip
> $$
> i = \frac{dq}{dt}
> $$
> :::

### 电压
> [!definition,每单位电荷通过物理元件时，功/能量的变化量] 
>> $$
>> v = \frac{dw}{dq}
>> $$

### 功率
> [!definition,xxx]
> $$
> P = \frac{dW}{dt} = \frac{dW}{dQ} * \frac{dQ}{dt} = vi
> $$

### 能量
> [!definition,xxx]
> $$
> W_{ab} = \int_{a}^{b} P(t)\,dt  
> $$
> $$
> W(t)=\int_{-\infty}^t P(\tau)\,d\tau
> $$

---

## 元件模型
### 电阻
> [!definition,欧姆定律]
> $$
> V=Ri
> $$
> $$
> i=\frac{1}{R}V=GV
> $$


### 电容
由
$$
Q = C*V  
$$
$$
\frac{dQ}{dt} = C \frac{dV(t)}{dt}
$$
即:
$$
i(t) = C \frac{dV(t)}{dt}
$$
则
$$
V(t) = \int_{-\infty}^{\tau} \frac{i({\tau})}{C}\,d{\tau}
=\int_{-\infty}^0 \frac{i({\tau})}{C}\,d{\tau}+\int_0^{\tau} \frac{i({\tau})}{C}\,d{\tau}
=V(0)+\frac1{C}\int_0^{\tau} i({\tau})\,d{\tau}
$$


### 电感
由
$$
LI=N\phi 
$$
$$
\frac{dN\phi}{dt} = L \frac{di(t)}{dt}
$$
即:
$$
V(t) = L \frac{di(t)}{dt}
$$
则
$$
i(t) = \int_{-\infty}^{\tau} \frac{V({\tau})}{L}\,d{\tau}
=\int_{-\infty}^0 \frac{V({\tau})}{L}\,d{\tau}+\int_0^{\tau} \frac{V({\tau})}{L}\,d{\tau}
=i(0)+\frac1{L}\int_0^{\tau} V({\tau})\,d{\tau}
$$

---

## KCL与KVL
### 节点、元件、回路、网目
* 节点数：  N(node)  
* 元件数：  B(branch)  
* 回路数：  L(loop)  
* 网目数：  M(mesh)  

> [!tip,注]
> * 网目指不可再分解为回路的回路
> * 一个未知电路中若有B个元件，则有2B个电路变量($V_x$和$I_x$)
> * 关系式：$M=B-(N-1)$

### KCL
:::caution
流出节点的总电流和为0（以流入为负）
$$
\sum_{x=1}^n I_x=0
$$
:::

### KVL
:::caution
经过元件的总压降和为0（以压降为正）
$$
\sum_{x=1}^n V_x=0
$$
:::




---
## 2B法
* $N$个节点，可根据$KCL$得到$N-1$个等式
* $M$个网目，可根据$KVL$得到$M$个等式
* $B$个元件，可根据$component model$得到$B$个等式

:::caution
根据$NMB$关系式可得总计  
$N-1+M+B=2B$  
个等式
:::


---

## 








