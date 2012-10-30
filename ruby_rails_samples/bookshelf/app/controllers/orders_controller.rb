class OrdersController < ApplicationController
  before_filter :authorize, :except => [:new, :create]
  layout "store"
  
  def new
    @cart = current_cart
    if @cart.line_items.empty?
      redirect_to root_url, notice: 'Your cart is empty'
      return
    end
    @order = Order.new  
  end
  
  def create
    @order = Order.new(params[:order])
    @order.add_line_items_from_cart(current_cart)
    
    if @order.save
      Cart.destroy(session[:cart_id])
      session[:cart_id] = nil
      redirect_to root_url
    else
      render 'new'
    end
  end
  
  def index
    @orders = Order.all
    render :layout => "application"
  end
end
