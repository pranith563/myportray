package myportray;

import java.sql.PreparedStatement;
import java.sql.ResultSet;

public class User {
	String name;
	String password;
	String email;
	public User(String username, String password)
	{
		this.name=username;
		this.password=password;
	}
	public void set_email(String email)
	{
		this.email = email;
	}
	public String get_email()
	{
		return email;
	}
	public void logIn() {
		try
		{
			DbConnection db= new DbConnection("myweb","root","1589");
			PreparedStatement preparedStatement;
			db.query="select ID from usrInfo where username = '" + name +"' password = '" + password +"'";
			preparedStatement = db.conn.prepareStatement(db.query);
			ResultSet rs = preparedStatement.executeQuery();
			while(rs.next())
			{
				int id = rs.getInt("ID");
			}
		
		
		}
		catch(Exception e)
		{
			e.printStackTrace();
		}
	}
}
