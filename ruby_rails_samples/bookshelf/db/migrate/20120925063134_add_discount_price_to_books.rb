class AddDiscountPriceToBooks < ActiveRecord::Migration
  def change
    add_column :books, :discount_price, :decimal,
    :precision=>8, :scale=>2,:dea

  end
end
