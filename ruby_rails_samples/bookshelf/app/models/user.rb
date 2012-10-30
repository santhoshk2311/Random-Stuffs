class User < ActiveRecord::Base
  validates :name, :presence => true, :uniqueness => true
  validates :password, :presence => true, :confirmation => true
  validates :password_confirmation, :presence => true
  
  def password
    @password
  end
  
  
  def password=(password)
    @password = password
    generate_salt
    self.hashed_password = self.class.encrypt_password(self.name, password, self.salt)
  end
  
  def self.encrypt_password(name,password,salt)
    Digest::SHA1.hexdigest("#{name}:#{password}:#{salt}")
  end
  
  def self.authenticate(name, password)
    if user = User.find_by_name(name)
      if user.hashed_password == self.encrypt_password(name,password,user.salt)
        user
      end
    end
  end
  
  def uploaded_picture=(picture_field)
    self.content_type = picture_field.content_type.chomp
    self.data = picture_field.read
  end
  
  private
  def generate_salt
    self.salt = self.object_id.to_s + rand.to_s
  end
  
end
