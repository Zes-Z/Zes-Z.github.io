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

## ループ変数の定義
### 電流

:::defi
 電流とは、単位時間に流れる電荷量である。
$$
i = \frac{dq}{dt}
$$
:::



### 電圧
:::defi
 電荷単位あたりの、物理素子を通過するときの仕事／エネルギーの変化量。
$$
v = \frac{dw}{dq}
$$
:::

### 電力
:::defi
電力とは
$$
P = \frac{dW}{dt} = \frac{dW}{dQ} * \frac{dQ}{dt} = vi
$$
:::

### エネルギー
:::tip
 電力Pを時間tについて積分したもの。
$$
W_{ab} = \int_{a}^{b} P(t)\,dt  
$$
$$
W(t)=\int_{-\infty}^t P(\tau)\,d\tau
$$
:::

---

## 素子モデル
### 抵抗
:::defi[欧姆定律]
$$
V=Ri
$$
$$
i=\frac{1}{R}V=GV
$$
:::


### コンデンサ
:::note
より
$$
Q = C*V  
$$
$$
\frac{dQ}{dt} = C \frac{dV(t)}{dt}
$$
すなわち：
$$
i(t) = C \frac{dV(t)}{dt}
$$
したがって、
$$
\begin{aligned}
V(t) &= \int_{-\infty}^{t} \frac{i({\tau})}{C}\,d{\tau}
=\int_{-\infty}^0 \frac{i({\tau})}{C}\,d{\tau}+\int_0^{t} \frac{i({\tau})}{C}\,d{\tau}\\
&=V(0)+\frac1{C}\int_0^{t} i({\tau})\,d{\tau}
\end{aligned}
$$
:::

### インダクタ
:::note
より
$$
LI=N\phi 
$$
$$
\frac{dN\phi}{dt} = L \frac{di(t)}{dt}
$$
すなわち：
$$
V(t) = L \frac{di(t)}{dt}
$$
したがって、
$$
\begin{aligned}
i(t) &= \int_{-\infty}^{t} \frac{V({\tau})}{L}\,d{\tau}
=\int_{-\infty}^0 \frac{V({\tau})}{L}\,d{\tau}+\int_0^{t} \frac{V({\tau})}{L}\,d{\tau}\\
&=i(0)+\frac1{L}\int_0^{t} V({\tau})\,d{\tau}
\end{aligned}
$$
:::

---

## KCLとKVL
### ノード・素子・ループ・メッシュ
* ノード数：  N(node)  
* 元件数：  B(branch)  
* ループ数：  L(loop)  
* メッシュ数：  M(mesh)  

:::defi[ノード(node)]
ノードとは、理想導線で直接接続され、同じ電位を持つループ上の点の集合である。  
ノードは「導線で直接つながった電気的な領域」であり、「小さな点」そのものではない。素子を挟まない連続した導線全体が同じノードとなる。
:::

:::defi[ループ(loop)]

:::

:::defi[メッシュ(mesh)]
これ以上小さなループに分割できないループを指す。
:::

:::warning[注]
* 一个未知电路中若有B个元件，したがって、有2B个电路变量($V_x$和$I_x$)
* 关系式：$M=B-(N-1)$
:::


### KCL
:::tip
ノードから流れ出る電流の代数和は0（流入電流を負とする）。
$$
\sum_{K=1}^n I_K=0
$$
:::

### KVL
:::tip
素子を通る電圧降下の代数和は0（降下を正とする）。
$$
\sum_{K=1}^n V_K=0
$$
:::


---
## 2B法
* $N$个ノード，可根据$KCL$得到$N-1$个等式
* $M$个メッシュ，可根据$KVL$得到$M$个等式
* $B$个元件，可根据$component model$得到$B$个等式

:::tip

根据NMB关系式が得られる总计 

$N-1+M+B=2B$  

个等式
:::


---

## 単純な抵抗ループの簡易解析 
### 合成抵抗を理解する
:::caution
$$
R_{eq} = R_1+R_2+...+R_n=R_a\parallel R_b\parallel...\parallel R_z
$$
`合成抵抗`と呼ぶのは、3つの抵抗値が数値的に等しいからではなく、`同じループ環境`において外部に現れる`電圧`と`電流`が等しいからである。因果関係を逆に捉えないこと。  

特に、並列ループの合成抵抗は次の式から、
$$
\frac{1}{R_{\mathrm{eq}}}=\sum_{i=1}^{n}\frac{1}{R_i}
$$
次のように導かれる：
$$ 
R_{\mathrm{eq}}=\frac{R_1R_2\cdots R_n}{\displaystyle\sum_{i=1}^{n}\left(\prod_{\substack{j=1\\j\ne i}}^{n}R_j\right)}
$$
例えば：
3つの抵抗を並列接続した場合の合成抵抗
$$
R_{eq}=\frac{R_1R_2R_3}{R_2R_3+R_1R_3+R_1R_2}
$$
:::

### 直列ループの分圧



### 並列ループの分流




### $\Delta$ 与 $Y$ ループの等価変換
:::note
$\Delta$ 转 $Y$
:::

:::note 
$Y$ 转 $\Delta$
:::