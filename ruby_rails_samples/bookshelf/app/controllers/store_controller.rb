class StoreController < ApplicationController
  def index
    @books = Book.order(:discount_price)
    @cart = current_cart
  end
end
