class CartsController < ApplicationController
   def index
    redirect_to cart_url(current_cart)
  end
  
  def show
    @cart = current_cart
  end
  
  def destroy
    @cart = current_cart
    @cart.destroy
    session[:cart_id] = nil
    
    redirect_to root_url
  end
end

