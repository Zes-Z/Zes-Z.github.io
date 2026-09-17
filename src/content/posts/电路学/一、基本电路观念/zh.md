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

:::tip
 电流是每单位时间通过的电荷量
$$
i = \frac{dq}{dt}
$$
:::



### 电压
:::tip
 每单位电荷通过物理元件时，功/能量的变化量
$$
v = \frac{dw}{dq}
$$
:::

### 功率
:::tip
功率是
$$
P = \frac{dW}{dt} = \frac{dW}{dQ} * \frac{dQ}{dt} = vi
$$
:::

### 能量
:::tip
 功率P对时间t的积分
$$
W_{ab} = \int_{a}^{b} P(t)\,dt  
$$
$$
W(t)=\int_{-\infty}^t P(\tau)\,d\tau
$$
:::

---

## 元件模型
### 电阻
:::definition[欧姆定律]
$$
V=Ri
$$
$$
i=\frac{1}{R}V=GV
$$
:::


### 电容
:::note
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
:::

### 电感
:::note
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
:::

---

## KCL与KVL
### 节点、元件、回路、网目
* 节点数：  N(node)  
* 元件数：  B(branch)  
* 回路数：  L(loop)  
* 网目数：  M(mesh)  

:::definition[节点(node)]
节点是电路中由理想导线直接连接起来的、具有相同电势的一组点。  
是“导线直接连通的电气区域”，不是“一个小圆点”，没有经过元件，整条导线都是同一个节点。
:::

:::definition[回路(loop)]

:::

:::definition[网目(mesh)]
指不可再分解为回路的回路
:::

:::warning[注]
* 一个未知电路中若有B个元件，则有2B个电路变量($V_x$和$I_x$)
* 关系式：$M=B-(N-1)$
:::


### KCL
:::tip
流出节点的总电流和为0（以流入为负）
$$
\sum_{x=1}^n I_x=0
$$
:::

### KVL
:::tip
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

:::tip

根据NMB关系式可得总计 

$N-1+M+B=2B$  

个等式
:::


---

## 简单电阻网路的速解法 
### 理解等效电阻
:::caution
$$
R_{eq} = R_1+R_2+...+R_n=R_a\parallel R_b\parallel...\parallel R_z
$$
之所以称为`等效电阻`不是因为三者在数值上相等，而是因为它们在`同样电路环境`中，对外部造成的`电压`和`电流`均相等，切不可倒果为因.  

特别的，在并联电路中，等效电阻公式可由：
$$
\frac{1}{R_{\mathrm{eq}}}=\sum_{i=1}^{n}\frac{1}{R_i}
$$
推导出：
$$ 
R_{\mathrm{eq}}=\frac{R_1R_2\cdots R_n}{\displaystyle\sum_{i=1}^{n}\left(\prod_{\substack{j=1\\j\ne i}}^{n}R_j\right)}
$$
例如：
3个电阻并联的等效电阻
$$
R_{eq}=\frac{R_1R_2R_3}{R_2R_3+R_1R_3+R_1R_2}
$$
:::

### 串联分压



### 并联分流




### $\Delta$ 与 $Y$ 电路等效变换
:::note
$\Delta$ 转 $Y$
:::

:::note 
$Y$ 转 $\Delta$
:::