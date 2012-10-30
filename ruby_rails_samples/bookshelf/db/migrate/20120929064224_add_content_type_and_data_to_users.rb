class AddContentTypeAndDataToUsers < ActiveRecord::Migration
  def change
    add_column :users, :content_type, :string
    add_column :users, :data, :binary
  end
end
