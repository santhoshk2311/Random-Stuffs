class ApplicationController < ActionController::Base
  protect_from_forgery
  
  private
  def current_cart
    Cart.find(session[:cart_id])
  rescue ActiveRecord::RecordNotFound
    cart = Cart.create
    session[:cart_id] = cart.id
    cart
  end
  
  private
  def authorize
    unless session[:user_id] && User.find(session[:user_id])
      redirect_to '/login'
    end
  end
end
