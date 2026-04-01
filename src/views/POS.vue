<template>
  <div class="pos-screen h-screen flex flex-col bg-app-bg text-text-primary font-inter overflow-hidden">
    <!-- B & H Pharmaceutical (PVT) LTD Header -->
    <header class="h-16 bg-card-bg border-b border-border flex items-center justify-between px-6 shrink-0 z-40">
      <div class="flex items-center gap-2">
        <div class="w-10 h-10 bg-brand rounded-xl flex items-center justify-center shadow-lg shadow-brand/20">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M15 9v12"/><path d="M15 15h6"/><path d="M3 15h12"/></svg>
        </div>
        <h1 class="text-xl font-extrabold tracking-tight text-text-primary ml-2"> <span class="font-normal">POS</span></h1>
      </div>
      <div class="flex items-center gap-3">
        <button v-if="!shiftStore.activeShift" @click="showOpenShiftModal = true" class="px-3 py-1.5 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white rounded-lg text-xs font-black uppercase tracking-widest border border-emerald-500/20 transition-all flex items-center gap-2">
          Open Shift
        </button>
        <div v-if="shiftStore.activeShift" class="flex items-center gap-3">
          <div class="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span class="text-xs font-black text-emerald-500 font-mono tracking-wider">{{ shiftElapsed }}</span>
          </div>
          <button @click="showCloseShiftModal = true" class="px-3 py-1.5 bg-brand/10 text-brand hover:bg-brand hover:text-white rounded-lg text-xs font-black uppercase tracking-widest border border-brand/20 transition-all flex items-center gap-2">
            Close Shift
          </button>
        </div>
        <button @click="exitPos" class="px-3 py-1.5 bg-hover-bg text-text-muted hover:text-rose-500 hover:bg-rose-50 rounded-lg text-xs font-black uppercase tracking-widest border border-border/50 transition-all flex items-center gap-2 group">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="group-hover:-translate-x-0.5 transition-transform"><path d="m15 18-6-6 6-6"/></svg>
          Back To Home
        </button>
      </div>
    </header>

    <!-- Main Content Area: 3 Columns -->
    <main class="flex-1 flex overflow-hidden bg-app-bg">
      
      <!-- Column 1: Item Catalog -->
      <section class="w-[480px] xl:w-[540px] flex flex-col border-r border-border shrink-0 bg-card-bg">
        <div class="p-6 space-y-6">
          <!-- Search Bar -->
          <div class="flex gap-2">
            <div class="relative flex-1 group">
              <span class="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-brand transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              </span>
              <input v-model="searchQuery" type="text" placeholder="Search item, SKU, or barcode..." 
                class="w-full bg-hover-bg/50 border border-border rounded-xl py-3.5 pl-12 pr-4 text-sm font-medium outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all text-text-primary placeholder:text-text-muted" />
            </div>
            <button @click="showRecentSalesModal = true" class="w-12 h-12 flex items-center justify-center rounded-xl bg-brand text-white shadow-lg shadow-brand/20 hover:bg-brand-hover transition-all active:scale-95">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 8V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2-2v2"/><path d="M21 16v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2"/><rect width="20" height="2" x="2" y="11" rx="1"/></svg>
            </button>
          </div>

          <!-- Category Tabs -->
          <div class="flex gap-2.5 overflow-x-auto pb-1 no-scrollbar">
            <button @click="selectedCategory = 'All'"
              :class="['px-5 py-2.5 rounded-full text-xs font-black whitespace-nowrap transition-all border shadow-sm',
                        selectedCategory === 'All' ? 'bg-brand border-brand text-white shadow-brand/10' : 'bg-card-bg border-border text-text-secondary hover:border-text-primary']"
            >
              All Items
            </button>
            <button v-for="cat in categories" :key="cat"
              @click="selectedCategory = cat"
              :class="['px-5 py-2.5 rounded-full text-xs font-black whitespace-nowrap transition-all border shadow-sm',
                        selectedCategory === cat ? 'bg-brand border-brand text-white shadow-brand/10' : 'bg-card-bg border-border text-text-secondary hover:border-text-primary']"
            >
              {{ cat }}
            </button>
          </div>
        </div>

        <!-- Scrollable Item Grid -->
        <div class="flex-1 overflow-y-auto px-6 pb-6">
          <div class="grid grid-cols-3 gap-5">
            <div 
              v-for="item in filteredItems" :key="item.id"
              @click="posStore.addToCart(item)"
              class="group relative bg-card-bg rounded-2xl border border-border p-4 transition-all hover:border-brand hover:shadow-xl hover:shadow-brand/5 cursor-pointer active:scale-[0.98]"
            >
              <!-- Stock Badge -->
              <span v-if="item.stock_quantity > 0" class="absolute -top-1 -right-1 min-w-[20px] h-5 flex items-center justify-center px-1 rounded-full bg-emerald-600 text-white text-[10px] font-black z-30 shadow-md border-2 border-card-bg">
                {{ item.stock_quantity }}
              </span>

              <div class="w-full aspect-square bg-hover-bg rounded-xl mb-4 flex items-center justify-center overflow-hidden border border-border group-hover:bg-hover-bg/80 relative">
                <img v-if="item.image" :src="item.image" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div v-else class="w-full h-full bg-hover-bg flex items-center justify-center">
                  <svg class="text-text-muted/30" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>
                </div>
                
                <!-- Zero Stock Overlay -->
                <div v-if="item.stock_quantity <= 0" class="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center text-center p-4">
                  <p class="text-[9px] font-black uppercase tracking-tight text-white drop-shadow-lg">Out of Stock</p>
                </div>
              </div>
              
              <h3 class="text-xs font-black text-text-primary line-clamp-1 mb-1">{{ item.name }}</h3>
              <p class="text-[9px] text-text-muted font-bold uppercase tracking-widest">{{ item.category || 'Product' }}</p>
              <p class="mt-3 text-[11px] font-black text-brand">{{ formatCurrency(item.sales_rate) }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Column 2: Current Order -->
      <section class="flex-1 min-w-[500px] flex flex-col border-r border-border shrink-0 bg-card-bg/50">
        <div class="px-6 py-5 flex items-center justify-between border-b border-border bg-card-bg">
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <h2 class="text-sm font-black text-text-primary">Current Order</h2>
            <span class="px-2 py-0.5 rounded bg-hover-bg text-[10px] font-black text-text-muted">#{{ Math.floor(Math.random() * 10000) }}</span>
          </div>
          <div class="flex items-center gap-4">
            <button @click="posStore.holdOrder()" class="text-[10px] font-black uppercase tracking-widest text-orange-500 flex items-center gap-1.5 hover:opacity-80 transition-opacity">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 3v18"/><path d="M3 12h18"/></svg>
              Hold
            </button>
            <button @click="posStore.clearCart()" class="text-[10px] font-black uppercase tracking-widest text-rose-500 flex items-center gap-1.5 hover:opacity-80 transition-opacity">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
              Clear
            </button>
          </div>
        </div>

        <!-- Order Items Table Header -->
        <div class="grid grid-cols-12 gap-2 px-6 py-3 bg-hover-bg/30 border-b border-border text-[9px] font-black uppercase tracking-widest text-text-muted">
          <div class="col-span-4">Item Name</div>
          <div class="col-span-2">Batch/Exp</div>
          <div class="col-span-1 text-center">Billed</div>
          <div class="col-span-1 text-center">Free</div>
          <div class="col-span-2 text-right">Price</div>
          <div class="col-span-2 text-right">Total</div>
        </div>

        <!-- Order Items List -->
        <div class="flex-1 overflow-y-auto p-4 space-y-2">
          <div v-for="(item, index) in posStore.cart" :key="item.id" 
            class="bg-card-bg rounded-xl border border-border/50 p-3 transition-all hover:border-brand/30 group"
          >
            <div class="grid grid-cols-12 gap-2 items-center">
              <!-- Item Name & Category -->
              <div class="col-span-4 min-w-0">
                <h4 class="text-xs font-black text-text-primary truncate">{{ item.name }}</h4>
                <p class="text-[9px] text-text-muted font-bold mt-0.5 truncate uppercase">{{ item.brand }}</p>
              </div>

              <!-- Batch & Expiry Selection -->
              <div class="col-span-2 space-y-1">
                <div class="relative group">
                  <input 
                    :value="item.batch_number" 
                    @input="e => handleBatchInput(item.id, (e.target as HTMLInputElement).value)"
                    @focus="activeBatchItemId = item.id"
                    placeholder="Batch"
                    class="w-full bg-hover-bg/50 border border-border rounded px-2 py-1 text-[10px] font-black outline-none focus:border-brand transition-all placeholder:text-[8px]"
                  />
                  <!-- Batch Dropdown -->
                  <div v-if="activeBatchItemId === item.id" data-batch-dropdown class="absolute left-0 right-0 top-full mt-1 bg-card-bg border border-border rounded shadow-2xl p-1 z-[70] space-y-0.5">
                    <div v-if="getItemBatches(item.id).length === 0" class="p-2 text-[8px] text-text-muted italic">No batches</div>
                    <div v-for="b in getItemBatches(item.id)" :key="b.id" @click="handleBatchSelect(item.id, b)" class="p-1.5 rounded hover:bg-hover-bg cursor-pointer border border-transparent hover:border-brand/20 transition-all">
                      <div class="flex justify-between items-center">
                        <span class="text-[9px] font-bold text-text-primary">{{ b.batch_number }}</span>
                        <span class="text-[8px] font-bold text-emerald-600">{{ b.quantity }}</span>
                      </div>
                      <p class="text-[7px] text-text-muted mt-0.5">Exp: {{ b.expiry_date }}</p>
                    </div>
                  </div>
                </div>
                <input 
                  v-model="item.expiry_date" 
                  @input="posStore.updateExpiry(item.id, item.expiry_date)"
                  placeholder="Exp"
                  class="w-full bg-rose-500/5 border border-rose-500/10 rounded px-2 py-1 text-[9px] font-bold text-rose-500 text-center uppercase tracking-tighter outline-none focus:border-rose-500/30"
                />
              </div>

              <!-- Billed Quantity -->
              <div class="col-span-1 flex flex-col items-center">
                <input type="number" v-model.number="item.quantity" @change="posStore.updateQuantity(item.id, item.quantity)"
                  class="w-12 bg-hover-bg rounded-md border border-border py-1.5 text-center text-[11px] font-black text-text-primary outline-none focus:border-emerald-500" />
              </div>

              <!-- Bonus Quantity (FREE) -->
              <div class="col-span-1 flex flex-col items-center">
                <input type="number" v-model.number="item.bonus_quantity" @change="posStore.updateBonus(item.id, item.bonus_quantity)"
                  class="w-12 bg-rose-500/10 text-rose-600 rounded-md border border-rose-500/20 py-1.5 text-center text-[11px] font-black outline-none focus:border-rose-500" />
              </div>

              <!-- Sales Rate -->
              <div class="col-span-2 text-right">
                <p class="text-xs font-black text-text-primary">{{ formatCurrency(item.sales_rate) }}</p>
                <p class="text-[9px] text-text-muted font-bold mt-0.5 uppercase tracking-tighter">Unit Price</p>
              </div>

              <!-- Total -->
              <div class="col-span-2 text-right flex items-center justify-end gap-2">
                <div class="text-right">
                  <p class="text-xs font-black text-brand">{{ formatCurrency(item.quantity * item.sales_rate) }}</p>
                  <p class="text-[9px] text-text-muted font-bold mt-0.5 uppercase tracking-tighter">Subtotal</p>
                </div>
                <button @click="posStore.cart.splice(index, 1)" class="p-1.5 text-text-muted hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all opacity-0 group-hover:opacity-100">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                </button>
              </div>
            </div>
          </div>

          <div v-if="posStore.cart.length === 0" class="flex flex-col items-center justify-center py-20 text-center opacity-30">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>
            <p class="text-xs font-black uppercase tracking-[0.2em] mt-4">Order is empty</p>
          </div>
        </div>

        <!-- Order Action Buttons -->
        <div class="p-4 grid grid-cols-2 gap-3 border-t border-border bg-card-bg">
          <button @click="showAddDiscountModal = true" class="flex items-center justify-center gap-2 py-3 rounded-xl border border-border text-xs font-black text-text-secondary hover:bg-hover-bg transition-all">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z"/><path d="M7 7h.01"/></svg>
            {{ posStore.discount > 0 ? `Discount: ${formatCurrency(posStore.discount)}` : 'Add Discount' }}
          </button>
          <button @click="showAddNoteModal = true" class="flex items-center justify-center gap-2 py-3 rounded-xl border border-border text-xs font-black text-text-secondary hover:bg-hover-bg transition-all">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4"/><path d="M4 6v12c0 1.1.9 2 2 2h14v-4"/><path d="M18 12a2 2 0 0 0-2 2c0 1.1.9 2 2 2h4v-4h-4Z"/></svg>
            {{ posStore.orderNote ? 'Edit Note' : 'Add Note' }}
          </button>
        </div>
      </section>

      <!-- Column 3: Summary & Checkout -->
      <section class="w-[380px] flex flex-col bg-card-bg/30">
        <!-- Customer Section -->
        <div class="p-6 border-b border-border">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">Customer</h3>
            <button @click="showRecentSalesModal = true" class="text-[10px] font-black uppercase tracking-widest text-brand underline underline-offset-4">Recent Sales</button>
          </div>
          <div @click="showCustomerSelectModal = true" class="flex items-center justify-between p-4 bg-card-bg rounded-2xl border border-border shadow-sm group cursor-pointer hover:border-brand transition-all">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center text-sm font-black border border-orange-500/20">
                {{ posStore.customerId ? partyStore.customers.find(p => p.id === posStore.customerId)?.name.substring(0,2).toUpperCase() : 'WK' }}
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-black text-text-primary">{{ posStore.customerId ? partyStore.customers.find(p => p.id === posStore.customerId)?.name : 'Walking Customer' }}</p>
                <p class="text-[10px] text-text-muted font-bold mt-1">Loyalty: <span class="text-emerald-500">1,240 pts</span></p>
              </div>
            </div>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" class="text-text-muted group-hover:text-text-primary transition-colors"><path d="m9 18 6-6-6-6"/></svg>
          </div>
        </div>

        <!-- Totals Summary -->
        <div class="flex-1 p-6 flex flex-col justify-end space-y-4">
          <div class="space-y-3 pb-6 border-b border-border border-dashed">
            <div class="flex justify-between items-center">
              <span class="text-xs font-bold text-text-secondary">Subtotal</span>
              <span class="text-xs font-black text-text-primary">{{ formatCurrency(posStore.subtotal) }}</span>
            </div>
            <div class="flex justify-between items-center text-emerald-500">
              <span class="text-xs font-bold">Billed Items</span>
              <span class="text-xs font-black">{{ posStore.totalBilledQuantity }}</span>
            </div>
            <div v-if="posStore.totalBonusQuantity > 0" class="flex justify-between items-center text-rose-500">
              <span class="text-xs font-bold">Free Items</span>
              <span class="text-xs font-black">{{ posStore.totalBonusQuantity }}</span>
            </div>
            <div v-if="posStore.discount > 0" class="flex justify-between items-center text-rose-500">
              <span class="text-xs font-bold">Discount</span>
              <span class="text-xs font-black">-{{ formatCurrency(posStore.discount) }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-xs font-bold text-text-secondary">Total Packets</span>
              <span class="text-xs font-black text-text-primary">{{ posStore.totalQuantity }}</span>
            </div>
          </div>
          
          <div class="flex justify-between items-center py-4">
            <h3 class="text-base font-black text-text-primary uppercase tracking-widest">Total</h3>
            <span class="text-3xl font-black text-brand">{{ formatCurrency(posStore.grandTotal) }}</span>
          </div>

          <!-- Actions Grid -->
          <div class="grid grid-cols-3 gap-3 pt-4">
            <button @click="showHeldOrdersModal = true" class="flex flex-col items-center justify-center py-4 rounded-2xl border border-border bg-card-bg hover:bg-hover-bg transition-all group">
              <span class="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 3v18"/><path d="M3 12h18"/></svg>
              </span>
              <p class="text-[9px] font-black uppercase tracking-widest text-text-muted">Held</p>
            </button>
            <button @click="showReceiptModal = true" class="flex flex-col items-center justify-center py-4 rounded-2xl border border-border bg-card-bg hover:bg-hover-bg transition-all group" :disabled="!latestInvoice">
              <span class="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 9V2h12v7"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect width="12" height="8" x="6" y="14"/></svg>
              </span>
              <p class="text-[9px] font-black uppercase tracking-widest text-text-muted">Print</p>
            </button>
            <button @click="posStore.clearCart()" class="flex flex-col items-center justify-center py-4 rounded-2xl border border-border bg-card-bg hover:bg-hover-bg transition-all group">
              <span class="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>
              </span>
              <p class="text-[9px] font-black uppercase tracking-widest text-text-muted">Void</p>
            </button>
          </div>
          
          <!-- Payment Method Selection -->
          <div class="pt-4">
            <p class="text-[10px] font-black uppercase tracking-widest text-text-muted mb-3 italic">Payment Method</p>
            <div class="grid grid-cols-4 gap-2">
              <button v-for="method in paymentMethods" :key="method.id"
                @click="selectedPaymentMethod = method.id"
                :class="['flex flex-col items-center justify-center py-3 rounded-xl border transition-all group relative overflow-hidden',
                        selectedPaymentMethod === method.id 
                        ? 'bg-brand border-brand shadow-lg shadow-brand/20 text-white' 
                        : 'bg-card-bg border-border text-text-muted hover:border-text-primary hover:bg-hover-bg']"
              >
                <div :class="['w-8 h-8 rounded-lg flex items-center justify-center mb-1.5 transition-transform group-active:scale-90', 
                            selectedPaymentMethod === method.id ? 'bg-white/20' : 'bg-hover-bg text-text-secondary group-hover:bg-brand/10 group-hover:text-brand']"
                      v-html="method.icon"
                >
                </div>
                <span class="text-[9px] font-black uppercase tracking-tighter">{{ method.label }}</span>
                
                <!-- Selection Indicator -->
                <div v-if="selectedPaymentMethod === method.id" class="absolute top-1 right-1">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
              </button>
            </div>
          </div>

          <!-- Large Pay Button -->
          <button @click="handlePay" :disabled="!shiftStore.activeShift" class="relative w-full bg-brand hover:bg-brand-hover shadow-xl shadow-brand/20 text-white rounded-2xl py-6 transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] mt-4 overflow-hidden group">
            <div class="flex items-center justify-center gap-6">
              <div class="text-left">
                <p class="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">Pay with</p>
                <p class="text-xl font-black">{{ paymentMethods.find(m => m.id === selectedPaymentMethod)?.label }}</p>
              </div>
              <div class="h-10 w-px bg-white/20"></div>
              <p class="text-3xl font-black">{{ formatRawCurrency(posStore.grandTotal) }}</p>
            </div>
            <div class="absolute right-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:translate-x-2 transition-transform">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </div>
            <div v-if="!shiftStore.activeShift" class="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center font-black text-white z-10 text-sm tracking-widest uppercase">
              Shift Closed
            </div>
          </button>

          <!-- Bottom Row Buttons -->
          <div class="grid grid-cols-2 gap-3 pb-4">
            <button @click="posStore.toggleReturnMode()" :class="{'border-brand bg-brand/10': isReturnMode}" class="py-3 rounded-xl bg-card-bg border border-border text-[10px] font-black uppercase tracking-widest text-text-secondary hover:bg-hover-bg transition-all">
              {{ isReturnMode ? 'Return Mode On' : 'Return Mode' }}
            </button>
            <button class="py-3 rounded-xl bg-card-bg border border-border text-[10px] font-black uppercase tracking-widest text-text-secondary hover:bg-hover-bg transition-all">More Options</button>
          </div>
        </div>
      </section>
    </main>

    <!-- Modals (Placed outside main for better positioning) -->
    <Teleport to="body">
      <!-- Held Orders Modal -->
      <div v-if="showHeldOrdersModal" class="fixed inset-0 bg-black/40 backdrop-blur-md z-50 flex items-center justify-center p-6">
        <div class="bg-card-bg rounded-3xl w-full max-w-xl shadow-2xl flex flex-col max-h-[80vh] overflow-hidden border border-border animate-in fade-in zoom-in duration-300">
          <div class="p-6 border-b border-border flex justify-between items-center bg-hover-bg/30">
            <h2 class="text-lg font-black text-text-primary uppercase tracking-widest">Held Orders</h2>
            <button @click="showHeldOrdersModal = false" class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-hover-bg text-text-muted transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </div>
          <div class="flex-1 overflow-y-auto p-6 space-y-3">
            <div v-if="posStore.heldOrders.length === 0" class="text-text-muted italic text-center py-12">No held orders found</div>
            <div v-for="order in posStore.heldOrders" :key="order.id" 
              class="p-4 border border-border rounded-2xl hover:border-brand cursor-pointer flex justify-between items-center transition-all group bg-app-bg" 
              @click="posStore.resumeOrder(order); showHeldOrdersModal = false"
            >
              <div>
                <p class="font-black text-text-primary">#{{ order.id.slice(0, 8) }}</p>
                <p class="text-[10px] text-text-muted font-bold mt-1 uppercase">{{ new Date(order.date).toLocaleString() }}</p>
              </div>
              <div class="flex items-center gap-4">
                <span class="px-2 py-1 rounded-md bg-brand/10 text-brand text-[10px] font-black">{{ order.items.length }} Items</span>
                <svg class="text-text-muted/30 group-hover:text-brand transition-all group-hover:translate-x-1" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="m9 18 6-6-6-6"/></svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Sales Modal -->
      <div v-if="showRecentSalesModal" class="fixed inset-0 bg-black/40 backdrop-blur-md z-50 flex items-center justify-center p-6">
        <div class="bg-card-bg rounded-3xl w-full max-w-xl shadow-2xl flex flex-col max-h-[80vh] overflow-hidden border border-border animate-in fade-in zoom-in duration-300">
          <div class="p-6 border-b border-border flex justify-between items-center bg-hover-bg/30">
            <h2 class="text-lg font-black text-text-primary uppercase tracking-widest">Recent Sales</h2>
            <button @click="showRecentSalesModal = false" class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-hover-bg text-text-muted transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </div>
          <div class="flex-1 overflow-y-auto p-6 space-y-3">
            <!-- Recent Sales Modal Items -->
            <div v-for="invoice in transactionStore.invoices.slice(0, 10)" :key="invoice.id" class="p-4 border border-border rounded-2xl flex justify-between items-center bg-app-bg hover:border-brand/30 transition-colors">
              <div>
                <p class="font-black text-text-primary">Invoice #{{ invoice.id.slice(0, 8) }}</p>
                <p class="text-[10px] text-text-muted font-bold mt-1 uppercase">{{ invoice.date }}</p>
              </div>
              <p class="font-black text-base text-brand">{{ formatCurrency(invoice.total_amount) }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Customer Select Modal -->
      <div v-if="showCustomerSelectModal" class="fixed inset-0 bg-black/40 backdrop-blur-md z-[100] flex items-center justify-center p-6">
        <div class="bg-card-bg rounded-3xl w-full max-w-xl shadow-2xl flex flex-col max-h-[80vh] overflow-hidden border border-border animate-in fade-in zoom-in duration-300">
          <div class="p-6 border-b border-border flex justify-between items-center bg-hover-bg/30">
            <h2 class="text-lg font-black text-text-primary uppercase tracking-widest">Select Customer</h2>
            <button @click="showCustomerSelectModal = false" class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-hover-bg text-text-muted transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </div>
          <div class="p-4 border-b border-border">
             <div class="relative flex-1 group">
                <span class="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-brand transition-colors">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                </span>
                <input v-model="customerSearchQuery" type="text" placeholder="Search customer by name or phone..." 
                  class="w-full bg-hover-bg/50 border border-border rounded-xl py-3 pl-12 pr-4 text-sm font-medium outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all text-text-primary placeholder:text-text-muted" />
              </div>
          </div>
          <div class="flex-1 overflow-y-auto p-4 space-y-2">
            <!-- Walk in customer option -->
            <div @click="posStore.customerId = null; showCustomerSelectModal = false" 
              :class="['p-4 border rounded-2xl cursor-pointer flex items-center gap-4 transition-all group', posStore.customerId === null ? 'border-brand bg-brand/5' : 'border-border bg-app-bg hover:border-brand/30']">
              <div class="w-12 h-12 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center text-sm font-black border border-orange-500/20">
                WK
              </div>
              <div class="flex-1">
                <p class="font-black text-text-primary group-hover:text-brand transition-colors">Walking Customer</p>
                <p class="text-[10px] text-text-muted font-bold mt-0.5">Default Walk-in</p>
              </div>
              <div v-if="posStore.customerId === null"><svg class="text-brand" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg></div>
            </div>
            <!-- Mapped customers -->
            <div v-for="customer in filteredCustomers" :key="customer.id" 
              @click="posStore.customerId = customer.id; showCustomerSelectModal = false"
              :class="['p-4 border rounded-2xl cursor-pointer flex items-center gap-4 transition-all group', posStore.customerId === customer.id ? 'border-brand bg-brand/5' : 'border-border bg-app-bg hover:border-brand/30']">
              <div class="w-12 h-12 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center text-sm font-black border border-orange-500/20 uppercase">
                {{ customer.name.substring(0,2) }}
              </div>
              <div class="flex-1">
                <p class="font-black text-text-primary group-hover:text-brand transition-colors">{{ customer.name }}</p>
                <p class="text-[10px] text-text-muted font-bold mt-0.5">{{ customer.phone || 'No Phone' }} • {{ customer.email || 'No Email' }}</p>
              </div>
              <div v-if="posStore.customerId === customer.id"><svg class="text-brand" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Add Discount Modal -->
      <div v-if="showAddDiscountModal" class="fixed inset-0 bg-black/40 backdrop-blur-md z-[100] flex items-center justify-center p-6">
        <div class="bg-card-bg rounded-3xl w-full max-w-sm shadow-2xl flex flex-col border border-border animate-in fade-in zoom-in duration-300">
          <div class="p-6 border-b border-border flex justify-between items-center bg-hover-bg/30">
            <h2 class="text-lg font-black text-text-primary uppercase tracking-widest">Apply Discount</h2>
            <button @click="showAddDiscountModal = false" class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-hover-bg text-text-muted transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </div>
          <div class="p-8 space-y-6">
            <div class="space-y-2">
              <label class="text-[10px] font-black uppercase tracking-widest text-text-muted">Discount Amount</label>
              <div class="relative">
                <span class="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted font-black">PKR</span>
                <input v-model.number="posStore.discount" type="number" 
                  class="w-full bg-hover-bg/50 border border-border rounded-2xl py-5 pl-14 pr-4 text-2xl font-black outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all text-text-primary" 
                  placeholder="0.00" />
              </div>
            </div>
            <div class="grid grid-cols-2 gap-3">
              <button @click="posStore.setDiscount(0); showAddDiscountModal = false" class="py-4 rounded-2xl border border-border text-xs font-black text-rose-500 hover:bg-rose-50 transition-all uppercase tracking-widest">Clear</button>
              <button @click="showAddDiscountModal = false" class="py-4 rounded-2xl bg-brand text-white text-xs font-black shadow-lg shadow-brand/20 hover:bg-brand-hover transition-all uppercase tracking-widest">Apply</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Add Note Modal -->
      <div v-if="showAddNoteModal" class="fixed inset-0 bg-black/40 backdrop-blur-md z-[100] flex items-center justify-center p-6">
        <div class="bg-card-bg rounded-3xl w-full max-w-md shadow-2xl flex flex-col border border-border animate-in fade-in zoom-in duration-300">
          <div class="p-6 border-b border-border flex justify-between items-center bg-hover-bg/30">
            <h2 class="text-lg font-black text-text-primary uppercase tracking-widest">Order Note</h2>
            <button @click="showAddNoteModal = false" class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-hover-bg text-text-muted transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </div>
          <div class="p-8 space-y-6">
            <div class="space-y-2">
              <label class="text-[10px] font-black uppercase tracking-widest text-text-muted">Notes for this order</label>
              <textarea v-model="posStore.orderNote" rows="4"
                class="w-full bg-hover-bg/50 border border-border rounded-2xl p-4 text-sm font-medium outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all text-text-primary placeholder:text-text-muted" 
                placeholder="Ex: No pickles, Extra napkins, Delivery by 6 PM..."></textarea>
            </div>
            <button @click="showAddNoteModal = false" class="w-full py-4 rounded-2xl bg-brand text-white text-xs font-black shadow-lg shadow-brand/20 hover:bg-brand-hover transition-all uppercase tracking-widest">Save Note</button>
          </div>
        </div>
      </div>

      <!-- Receipt Modal -->
      <div v-if="showReceiptModal && latestInvoice" class="fixed inset-0 bg-black/40 backdrop-blur-md z-[100] flex items-center justify-center p-4 print:p-0 animate-in fade-in duration-300">
        <div class="bg-card-bg rounded-3xl w-full max-w-sm shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border border-border print:shadow-none print:w-[80mm] print:border-none print:h-auto print:mx-auto">
          <div id="receipt-content" class="p-8 flex-1 overflow-y-auto bg-card-bg text-text-primary print:bg-white print:text-black print:p-0">
            <!-- Template Selection Dropdown (Only visible on screen) -->
            <div class="mb-6 print:hidden">
              <label class="text-[10px] font-black uppercase tracking-widest text-text-muted mb-2 block">Choose Print Template</label>
              <div class="grid grid-cols-3 gap-2">
                <button v-for="t in ['Thermal', 'Professional', 'Minimal']" :key="t"
                  @click="selectedTemplate = t"
                  :class="['px-3 py-2 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all',
                          selectedTemplate === t ? 'bg-brand text-white border-brand shadow-lg shadow-brand/20' : 'bg-hover-bg text-text-secondary border-border hover:border-text-primary']"
                >
                  {{ t }}
                </button>
              </div>
            </div>

            <!-- THERMAL TEMPLATE -->
            <div v-if="selectedTemplate === 'Thermal'" class="thermal-layout">
              <!-- Receipt Branding -->
            <div class="text-center mb-8">
              <h2 class="text-xl font-black uppercase tracking-widest text-text-primary print:text-black">{{ companyStore.company?.name || 'B & H Pharmaceutical (PVT) LTD' }}</h2>
              <p class="text-[10px] text-text-muted print:text-gray-500 font-bold mt-1 uppercase tracking-wider">{{ companyStore.company?.address || 'Main POS Terminal' }}</p>
              <div class="mt-6 border-y border-border border-dashed py-3 print:border-gray-300">
                <h3 class="font-black text-sm tracking-[0.3em] uppercase">Sale Receipt</h3>
              </div>
            </div>
            
            <div class="flex justify-between text-[10px] mb-6 font-bold uppercase tracking-wide">
              <div>
                <p class="text-text-muted print:text-gray-500 italic mb-1">Date</p>
                <p>{{ latestInvoice.date }}</p>
              </div>
              <div class="text-right">
                <p class="text-text-muted print:text-gray-500 italic mb-1">Invoice</p>
                <p>#{{ latestInvoice.id.slice(0, 8) }}</p>
              </div>
            </div>

            <table class="w-full text-[10px] text-left mb-8">
              <thead class="border-b border-border border-dashed text-text-muted print:border-gray-200 uppercase tracking-widest font-black">
                <tr>
                  <th class="py-2">Item (Batch)</th>
                  <th class="py-2 text-center">B+F</th>
                  <th class="py-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody class="border-b border-border border-dashed print:border-gray-200">
                <tr v-for="item in latestInvoice.items" :key="item.item_id" class="font-bold">
                  <td class="py-3 pr-2">
                    {{ item.name }}<br/>
                    <small class="text-text-muted opacity-60">Batch: {{ item.batch_number }} | Exp: {{ item.expiry_date }}</small>
                  </td>
                  <td class="py-3 text-center">{{ item.quantity }}+{{ item.bonus_quantity }}</td>
                  <td class="py-3 text-right">{{ formatRawCurrency(item.total) }}</td>
                </tr>
              </tbody>
            </table>

            <div class="space-y-2 mb-8">
              <div class="flex justify-between items-center text-[10px] font-bold text-text-muted uppercase tracking-widest">
                <span>Total Items</span>
                <span>{{ latestInvoice.items.length }}</span>
              </div>
              <div class="flex justify-between items-center text-base font-black text-text-primary print:text-black">
                <span class="uppercase tracking-widest">Grand Total</span>
                <span class="text-brand text-xl">{{ formatCurrency(latestInvoice.total_amount) }}</span>
              </div>
            </div>

              <div class="pt-8 text-center text-[9px] text-text-muted print:text-gray-500 border-t border-border border-dashed">
                <p class="font-black uppercase tracking-widest">Thank you for visiting!</p>
                <p class="mt-1">Powered by Virtual Tech Solution</p>
              </div>
            </div>

            <!-- PROFESSIONAL A4 TEMPLATE -->
            <div v-if="selectedTemplate === 'Professional'" class="professional-layout text-left space-y-8">
               <div class="flex justify-between items-start border-b-2 border-text-primary pb-6">
                  <div>
                    <h2 class="text-2xl font-black uppercase tracking-tighter">{{ companyStore.company?.name || 'B & H Pharmaceutical (PVT) LTD' }}</h2>
                    <p class="text-xs text-text-muted mt-1 leading-relaxed">{{ companyStore.company?.address || 'Main POS Terminal' }}</p>
                    <p class="text-[10px] font-bold text-brand mt-2">Ph: {{ companyStore.company?.phone || '+92 000 0000000' }}</p>
                  </div>
                  <div class="text-right">
                    <h1 class="text-4xl font-black text-text-muted/15 uppercase tracking-widest leading-none mb-2">Invoice</h1>
                    <p class="text-xs font-black uppercase tracking-widest">#{{ latestInvoice.id.slice(0, 8) }}</p>
                    <p class="text-[10px] text-text-muted font-bold mt-1 uppercase">{{ latestInvoice.date }}</p>
                  </div>
               </div>

               <div>
                 <p class="text-[10px] font-black uppercase tracking-widest text-text-muted mb-2">Billed To</p>
                 <h4 class="text-sm font-black text-text-primary">{{ latestInvoice.customerName }}</h4>
                 <p class="text-xs text-text-secondary mt-1">Walk-in Customer</p>
               </div>                <table class="w-full text-sm">
                   <thead class="bg-hover-bg border-y border-border">
                     <tr>
                       <th class="py-3 px-4 font-black uppercase tracking-widest text-[10px]">Description</th>
                       <th class="py-3 px-4 text-center font-black uppercase tracking-widest text-[10px]">Batch/Exp</th>
                       <th class="py-3 px-4 text-center font-black uppercase tracking-widest text-[10px]">Billed+Free</th>
                       <th class="py-3 px-4 text-right font-black uppercase tracking-widest text-[10px]">Unit Price</th>
                       <th class="py-3 px-4 text-right font-black uppercase tracking-widest text-[10px]">Total</th>
                     </tr>
                   </thead>
                   <tbody class="divide-y divide-border/50">
                     <tr v-for="item in latestInvoice.items" :key="item.item_id">
                       <td class="py-4 px-4">
                         <p class="font-bold text-text-primary">{{ item.name }}</p>
                         <p class="text-[9px] text-text-muted uppercase tracking-tighter">{{ item.brand }}</p>
                       </td>
                       <td class="py-4 px-4 text-center text-[10px] font-mono">
                         {{ item.batch_number }}<br/>
                         <span class="text-[8px] opacity-60">{{ item.expiry_date }}</span>
                       </td>
                       <td class="py-4 px-4 text-center font-mono">
                         {{ item.quantity }} + <span class="text-rose-500 font-black">{{ item.bonus_quantity }}</span>
                       </td>
                       <td class="py-4 px-4 text-right font-mono">{{ formatRawCurrency(item.rate) }}</td>
                     </tr>
                   </tbody>
                </table>

               <div class="flex justify-end pt-6">
                 <div class="w-64 space-y-3">
                    <div class="flex justify-between items-center text-xs">
                      <span class="font-bold text-text-muted">Subtotal</span>
                      <span class="font-mono">{{ formatRawCurrency(latestInvoice.total_amount) }}</span>
                    </div>
                    <div class="flex justify-between items-center text-xs">
                      <span class="font-bold text-text-muted">Tax (0%)</span>
                      <span class="font-mono">0.00</span>
                    </div>
                    <div class="pt-3 border-t-2 border-text-primary flex justify-between items-center">
                      <span class="font-black text-sm uppercase tracking-widest">Grand Total</span>
                      <span class="text-xl font-black text-brand">{{ formatCurrency(latestInvoice.total_amount) }}</span>
                    </div>
                 </div>
               </div>

               <div v-if="latestInvoice.notes" class="pt-8 border-t border-border border-dashed">
                 <p class="text-[10px] font-black uppercase tracking-widest text-text-muted mb-2">Notes</p>
                 <p class="text-xs text-text-secondary leading-relaxed italic">{{ latestInvoice.notes }}</p>
               </div>
            </div>

            <!-- MINIMAL TEMPLATE -->
             <div v-if="selectedTemplate === 'Minimal'" class="minimal-layout text-center py-4 divide-y divide-border divide-dashed">
                <div class="pb-4">
                  <h2 class="text-sm font-black">{{ companyStore.company?.name }}</h2>
                  <p class="text-[10px] text-text-muted font-bold mt-1">#{{ latestInvoice.id.slice(0, 8) }} • {{ latestInvoice.date }}</p>
                </div>
                <div class="py-4 text-left space-y-1">
                  <div v-for="item in latestInvoice.items" :key="item.item_id" class="flex justify-between text-xs font-bold">
                    <span>{{ item.quantity }}x {{ item.name }}</span>
                    <span>{{ formatRawCurrency(item.total) }}</span>
                  </div>
                </div>
                <div class="pt-4 flex justify-between items-center">
                  <span class="text-[10px] font-black uppercase tracking-widest">Total</span>
                  <span class="text-lg font-black text-brand">{{ formatCurrency(latestInvoice.total_amount) }}</span>
                </div>
             </div>
          </div>
          
          <div class="p-6 border-t border-border bg-hover-bg/30 flex flex-col gap-3 print:hidden shrink-0">
            <div class="grid grid-cols-2 gap-3">
              <button @click="printReceipt" class="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-black text-[10px] uppercase tracking-widest py-4 rounded-2xl transition-all shadow-lg shadow-blue-500/20 active:scale-95 flex items-center justify-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect width="12" height="8" x="6" y="14"/></svg>
                Print
              </button>
              <button @click="shareToWhatsApp" class="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[10px] uppercase tracking-widest py-4 rounded-2xl transition-all shadow-lg shadow-emerald-500/20 active:scale-95 flex items-center justify-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                WhatsApp
              </button>
            </div>
            <button @click="finalizeSale" class="w-full bg-brand hover:bg-brand-hover text-white font-black text-xs uppercase tracking-[0.2em] py-5 rounded-2xl transition-all shadow-xl shadow-brand/20 active:scale-[0.98] flex items-center justify-center gap-3 group">
              Confirm Payment
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" class="group-hover:translate-x-1 transition-transform"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </button>
          </div>
        </div>
      </div>
      <!-- Shift Modal (Open) -->
      <ShiftModal v-if="showOpenShiftModal" type="open" @close="showOpenShiftModal = false" />
      <!-- Shift Modal (Close) -->
      <ShiftModal v-if="showCloseShiftModal" type="close" @close="showCloseShiftModal = false" />
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useInventoryStore } from '../stores/inventory';
import { usePartyStore } from '../stores/parties';
import { useTransactionStore } from '../stores/transactions';
import { useCompanyStore } from '../stores/company';
import { usePosStore } from '../stores/pos';
import { useShiftStore } from '../stores/shift';
import { useBatchStore } from '../stores/batches';
import ShiftModal from '../components/ShiftModal.vue';
import { storeToRefs } from 'pinia';

const inventoryStore = useInventoryStore();
const partyStore = usePartyStore();
const transactionStore = useTransactionStore();
const companyStore = useCompanyStore();
const posStore = usePosStore();
const shiftStore = useShiftStore();
const batchStore = useBatchStore();
const router = useRouter();
const activeBatchItemId = ref<string | null>(null);
const { isReturnMode } = storeToRefs(posStore);

// Shift timer
const shiftElapsed = ref('00:00:00');
let shiftTimerInterval: ReturnType<typeof setInterval> | null = null;

function updateShiftTimer() {
  if (shiftStore.activeShift?.start_time) {
    const startMs = new Date(shiftStore.activeShift.start_time).getTime();
    const diff = Math.floor((Date.now() - startMs) / 1000);
    const h = String(Math.floor(diff / 3600)).padStart(2, '0');
    const m = String(Math.floor((diff % 3600) / 60)).padStart(2, '0');
    const s = String(diff % 60).padStart(2, '0');
    shiftElapsed.value = `${h}:${m}:${s}`;
  } else {
    shiftElapsed.value = '00:00:00';
  }
}

function startShiftTimer() {
  stopShiftTimer();
  updateShiftTimer();
  shiftTimerInterval = setInterval(updateShiftTimer, 1000);
}

function stopShiftTimer() {
  if (shiftTimerInterval) {
    clearInterval(shiftTimerInterval);
    shiftTimerInterval = null;
  }
}

watch(() => shiftStore.activeShift, (newShift) => {
  if (newShift) {
    startShiftTimer();
  } else {
    stopShiftTimer();
    shiftElapsed.value = '00:00:00';
  }
});

onUnmounted(() => stopShiftTimer());

function exitPos() {
  router.push('/');
}

const searchQuery = ref('');
const selectedCategory = ref('All');
const showHeldOrdersModal = ref(false);
const showRecentSalesModal = ref(false);
const showReceiptModal = ref(false);
const showAddDiscountModal = ref(false);
const showAddNoteModal = ref(false);
const showCustomerSelectModal = ref(false);
const showOpenShiftModal = ref(false);
const customerSearchQuery = ref('');
const showCloseShiftModal = ref(false);
const latestInvoice = ref<any>(null);
const selectedTemplate = ref('Thermal');
const selectedPaymentMethod = ref('Cash');

const paymentMethods = [
  { 
    id: 'Cash', 
    label: 'Cash', 
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="12" x="2" y="6" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M6 12h.01M18 12h.01"/></svg>'
  },
  { 
    id: 'Card', 
    label: 'Card', 
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>'
  },
  { 
    id: 'EasyPaisa', 
    label: 'EasyPaisa', 
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h7"/><path d="M16 5V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v2"/><path d="M3 9h18"/><circle cx="18" cy="18" r="3"/></svg>'
  },
  { 
    id: 'JazzCash', 
    label: 'JazzCash', 
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M7 11V7a5 5 0 0 1 10 0v4"/><rect width="18" height="11" x="3" y="11" rx="2"/><circle cx="12" cy="16" r="1"/></svg>'
  }
];

// Close dropdown on outside click
function handleClickOutside(e: MouseEvent) {
  const target = e.target as HTMLElement;
  if (!target.closest('[data-batch-dropdown]')) {
    activeBatchItemId.value = null;
  }
}

onMounted(async () => {
  document.addEventListener('click', handleClickOutside);
  await shiftStore.initializeActiveShift();
  if (shiftStore.activeShift) {
    startShiftTimer();
  }
  await inventoryStore.fetchItems();
  await partyStore.fetchParties();
  await batchStore.fetchBatches();
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});

function getItemBatches(itemId: string) {
  return batchStore.getBatchesForItem(itemId);
}

function handleBatchInput(itemId: string, val: string) {
  posStore.updateBatch(itemId, val);
}

function handleBatchSelect(itemId: string, batch: any) {
  posStore.updateBatchId(itemId, batch.id, batch.batch_number, batch.expiry_date || '');
  activeBatchItemId.value = null;
}

function printReceipt() {
    const el = document.getElementById("receipt-content");
    if (!el) return;

    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document;
    if (!doc) return;

    const styleLinks = Array.from(document.styleSheets)
      .map(sheet => {
        try {
          return Array.from(sheet.cssRules).map(rule => rule.cssText).join('');
        } catch (e) {
          return '';
        }
      }).join('');

    doc.write(`
      <html>
        <head>
          <title>Print Receipt</title>
          <style>
            ${styleLinks}
            body { background: white !important; margin: 0; padding: 20px; font-family: sans-serif; }
            .print\\:hidden { display: none !important; }
            @page { margin: 0; }
            
            ${selectedTemplate.value === 'Thermal' ? `
              @page { size: 80mm auto; }
              body { width: 80mm; padding: 5mm; margin: 0 auto; }
              .thermal-layout { display: block !important; }
              .professional-layout, .minimal-layout { display: none !important; }
            ` : ''}

            ${selectedTemplate.value === 'Professional' ? `
              @page { size: A4; margin: 15mm; }
              body { width: auto; max-width: 100%; padding: 0; }
              .professional-layout { display: block !important; }
              .thermal-layout, .minimal-layout { display: none !important; }
            ` : ''}

            ${selectedTemplate.value === 'Minimal' ? `
              @page { size: 80mm auto; }
              body { width: 80mm; padding: 5mm; margin: 0 auto; }
              .minimal-layout { display: block !important; }
              .thermal-layout, .professional-layout { display: none !important; }
            ` : ''}
          </style>
        </head>
        <body>
          <div class="print-container">
            ${el.innerHTML}
          </div>
          <script>
            window.onload = () => {
              window.print();
              setTimeout(() => {
                window.parent.document.body.removeChild(window.parent.document.querySelector('iframe[style*="fixed"]'));
              }, 500);
            };
          <\/script>
        </body>
      </html>
    `);

    doc.close();
}

function shareToWhatsApp() {
    if (!latestInvoice.value) return;
    const message = `*Invoice Receipt*\nFrom: ${companyStore.company?.name || 'B & H Pharmaceutical (PVT) LTD'}\nInvoice: #${latestInvoice.value.id.slice(0, 8)}\nDate: ${latestInvoice.value.date}\nTotal: ${formatCurrency(latestInvoice.value.total_amount)}\n\nThank you for your business!`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}

function finalizeSale() {
    showReceiptModal.value = false;
    latestInvoice.value = null;
}

const categories = computed(() => {
  const cats = inventoryStore.items.map(i => i.category).filter((c): c is string => !!c);
  return [...new Set(cats)];
});

const filteredItems = computed(() => {
  let items = inventoryStore.items;
  
  if (selectedCategory.value !== 'All') {
    items = items.filter(i => i.category === selectedCategory.value);
  }
  
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    items = items.filter(i => 
      i.name.toLowerCase().includes(q) ||
      i.sku?.toLowerCase().includes(q)
    );
  }
  
  return items;
});

const filteredCustomers = computed(() => {
  let customers = partyStore.customers;
  if (customerSearchQuery.value) {
    const q = customerSearchQuery.value.toLowerCase();
    customers = customers.filter(c => 
      c.name.toLowerCase().includes(q) || 
      (c.phone && c.phone.toLowerCase().includes(q)) || 
      (c.email && c.email.toLowerCase().includes(q))
    );
  }
  return customers;
});

async function handlePay() {
  if (posStore.cart.length === 0) return;
  if (!shiftStore.activeShift) {
    alert('Please open a shift before processing payments.');
    return;
  }
  
  const customerName = posStore.customerId 
      ? partyStore.customers.find(p => p.id === posStore.customerId)?.name || 'Walking Customer'
      : 'Walking Customer';

  const invoice = {
    date: new Date().toISOString().split('T')[0],
    customer_id: posStore.customerId || 'walking-customer',
    shift_id: shiftStore.activeShift?.id,
    total_amount: posStore.grandTotal,
    discount_amount: posStore.discount,
    notes: posStore.orderNote,
    items: posStore.cart.map(i => ({
      item_id: i.id,
      name: i.name,
      quantity: i.quantity,
      bonus_quantity: i.bonus_quantity,
      batch_number: i.batch_number,
      expiry_date: i.expiry_date,
      rate: i.sales_rate,
      total: i.quantity * i.sales_rate
    }))
  };

  try {
    const invoiceId = await transactionStore.createInvoice(invoice as any);
    
    await transactionStore.createPayment({
        date: invoice.date as string,
        party_id: invoice.customer_id,
        party_type: 'Customer' as const,
        payment_type: 'Receive' as const,
        account_id: selectedPaymentMethod.value.toLowerCase(), 
        amount: invoice.total_amount,
        memo: `POS Sale Receipt #${invoiceId} via ${selectedPaymentMethod.value}`,
        reference_type: 'SalesInvoice' as const,
        reference_id: invoiceId,
        shift_id: shiftStore.activeShift?.id
    });

    latestInvoice.value = {
        ...invoice,
        id: invoiceId,
        customerName
    };
    
    posStore.clearCart();
    showReceiptModal.value = true;
  } catch (e) {
    console.error(e);
    alert('Failed to process payment');
  }
}

function formatCurrency(val: number) {
  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: companyStore.company?.currency || 'PKR',
    minimumFractionDigits: 0
  }).format(val || 0);
}

function formatRawCurrency(val: number) {
  return (val || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

.pos-screen {
  font-family: 'Inter', sans-serif;
  letter-spacing: -0.01em;
}

input::placeholder {
  color: #9CA3AF;
  font-weight: 500;
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

::-webkit-scrollbar {
  width: 5px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: var(--border);
  border-radius: 10px;
}
::-webkit-scrollbar-thumb:hover {
  background: var(--text-muted);
}

/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type=number] {
  -moz-appearance: textfield;
}

@media print {
  @page {
    margin: 0;
  }
  
  body * {
    visibility: hidden;
  }
  
  #receipt-content, #receipt-content * {
    visibility: visible;
  }
  
  #receipt-content {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    margin: 0;
    padding: 0;
    background: white;
  }
}
</style>
