import styled from "styled-components";
import { apiPath } from "../constants";

const Styled = styled.div`

.button-box{
  padding: 0px 68px 0px 5px;
}

.line-box{
    border: 2px solid #32b89d;
    margin:0px 130px 0px 130px;
  }

.logo {
  padding: 5px;
  width: 130px;
  height: 130px;
 }

 .row{
  display: flex;
  justify-content: center;
 }

 .row-box{
    color: black;
    font-size: 40px;
    line-height: 1.25;
    margin: 49px 39px 1px 19px;
    width:90%;
  }

p{
  margin-top: -6px;
  margin-bottom: 0rem;
  font-family: Bebas Neue Book;
  font-size: 80px;
  text-align:center;
}

.box-1, .col{
  display: inline-block;
  overflow: hidden;
}

.image{
  max-width:100%;
  max-height:10%;
}

.btn-ms-login {
    border: 3px solid #32b89d;
    box-sizing: border-box;
    border-radius: 40px;
    font-size: 15px;
    padding: 8px 30px;
    color: black;
    font-family: 'Lato';
    text-decoration: none;
    margin: 31px 19px 19px 6px;
    img {
      width: 20px;
      margin-right: 20px;
    }
}

  @media (min-width:350px) and (max-width: 767px) {
  .row{
    display: flex;
    justify-content:center;
  }

  .row-box{
    color: black;
    font-size: 40px;
    line-height: 1.25;
    margin: 40px 39px 1px 19px;
    width:90%;
  }
  .line-box{
    border: 2px solid #32b89d;
    margin: 9px 97px 3px 107px;
  }
  .image{
    max-height: 100%;
    height: 100%;
    width: 100%
  }
  .btn-ms-login {
    font-size: 15px;
    padding: 13px 30px 12px 29px;
    margin:  31px -60px 17px 8px;
    justify-content: center;
  }
}

@media (min-width:768px) and (max-width:1024px) {
  .row-box-2{
    display: flex;
    justify-content:start;
    height: 100vh;
  }


  .row-box{
    color: black;
    font-size: 40px;
    line-height: 1.25;
    margin: 173px 39px 1px 19px;
    width:90%;
  }
  .logo {
    position:absolute;
	  top:0;
	  left:22px;
  }

  .line-box{
    border: 2px solid #32b89d;
    margin: 9px 200px 0px 15px;
  }
  .image{
    max-height: 100%;
    height: 100vh;
    width: 100%
  }
  .btn-ms-login {
    font-size: 15px;
    padding: 14px 25px 12px 23px;
    margin: 64px -52px 48px -7px;
    justify-content: center;
  }
  p{
    text-align: initial;
    font-size: 70px;
  }
}
@media (min-width:1024px) and (max-width:1440px)   {
  .row-box-2{
    display: flex;
    justify-content:start;
    height: 100vh;
  }

  .row-box{
    color: black;
    font-size: 40px;
    line-height: 1.25;
    margin: 173px 39px 1px 19px;
    width:90%;
  }

  .logo {
    position:absolute;
	  top:0;
	  left:22px;
  }

  .line-box{
    border: 2px solid #32b89d;
    margin:10px 235px 0px 15px;
  }

  .image{
    max-height: 100%;
    height: 100vh;
    width: 100%
  }

  .btn-ms-login {
    font-size: 18px;
    padding: 18px 57px 15px 49px;
    margin: 55px -40px 43px -8px;
    justify-content: center;
  }

  p{
    text-align: initial;
    font-size: 70px;
  }
}

@media screen and (min-width:1440px)   {
  .row-box-2{
    display: flex;
    justify-content:start;
    height: 100vh;
  }

  .row-box{
    color: black;
    font-size: 40px;
    line-height: 1.25;
    margin: 173px 39px 1px 19px;
    width:90%;
  }

  .logo {
    position:absolute;
	  top:0;
	  left:22px;
  }

  .line-box{
    border: 2px solid #32b89d;
    margin: 9px 400px 0px 15px;
  }

  .image{
    max-height: 100%;
    height: 100vh;
    width: 100%
  }

  .btn-ms-login {
    position:absolute;
	  bottom:-10px;
    font-size: 18px;
    padding: 18px 57px 15px 49px;
    margin: 100px -30px 43px -8px;
    justify-content: center;
  }

  p{
    text-align: initial;
    font-size: 70px;
  }
}
`;

const Login = () => {
  return (
    <Styled>
      <div className="container-fluid">
        <div className="row-box-2">
          <div className="box-2 col-md-5">
            <div className="row">
              <img
                  src={require('../assets/images/logo.png').default}
                  alt="Medha SIS"
                  className='logo'
              />
            </div>
            <div className="row-box">
              <p id="text" >STUDENT </p> <p>INFORMATION</p> <p>SYSTEM</p>
            </div>
            <div className="line-box"> </div>
            <div className=" button-box" style={{textAlign:"center"}}>
              <a type="button" href={apiPath('/connect/microsoft')} className="btn-ms-login d-flex">
                  <img
                    src={require('../assets/images/logo-microsoft.svg').default}
                    alt="Microsoft"
                    className={`mr-5`}

                  />
                  <span style={{fontFamily:"Latto-Regular", textAlign:"center"}}>Login using Microsoft account</span>
              </a>
            </div>
        </div>
        <div className="box-1 col-md-7">
          <img
              src={require('../assets/images/web-image.png').default}
              alt="Medha SIS"
              className='image'
              width="400" height="400"
          />
        </div>
      </div>
    </div>
    </Styled>
  );
};

export default Login;
