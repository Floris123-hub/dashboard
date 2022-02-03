<template>
    <div>
        <div class="left__side w-50 float-left"></div>
        <div class="right__ride w-50 pt-4 float-right">
            <div class="login__form text-center pt-5">
                <h2 class="font-weight-bold">Hello, Friends!</h2>
                <h6 class="form__title2 mx-auto py-1">
                    Enter your personal details and start your
                            journey with us today.
                </h6>
                <b-form class="form__inputs__container mx-auto pt-5">
                    <input type="email" class="form__input mb-3" placeholder="Email address">
                    <input type="password" class="form__input mt-3" placeholder="Password">
                    <a href="#" class="forgot__password w-100 d-flex justify-content-end py-1">Forgot password?</a>
                    <b-button-group vertical class="w-100 my-4">
                        <router-link to="/chats" :href="myPath+'/chats'" class="text-light w-100">
                            <b-button variant="primary" class="form__button main__blue__background font-weight-bold py-3 w-100">
                                Sign in
                            </b-button>
                        </router-link>
                        <router-link to="/signup" :href="myPath+'/signup'" class="main__blue__color form__button font-weight-bold py-3 mx-auto">Sign up</router-link>
                    </b-button-group>
                </b-form>
                <p class="form__footer mt-5 mb-0">
                    <a href="#" class="text-dark">Term of use, Privacy policy</a>
                </p>
            </div>
        </div>
    </div>
</template>

<script>
    import path from "../../vue.config.js"
    export default {
        name: 'SignIn',
        data() {
            return {
                myPath: path.publicPath
            }
        },
    }
</script>

<style scoped>

    /* T H E   M A I N   B L U E   C O L O R */
    .main__blue__color{
        color: #395BB6;
    }

    /* T H E   M A I N   B L U E   C O L O R */
    .main__blue__background{
        background: #395BB6;
    }

    /* L E F T   S I D E   O R   B A C K G R O U N D   S I D E */
    .left__side{
        height: 100vh;
        background: url("../assets/background.png");
        background-size: 100% 100%;
    }

    /* R I G H T   S I D E   O R   F O R M   S I D E */
    .right__ride{
        height: 100vh;
    }

    /* F O R M */
    .login__form{
        height: 100%;
    }

    /* F O R M ' S   T I T L E   T W O */
    .form__title2{
        font-size: 11px;
        width: 210px;
    }

    /* F O R M   I N P U T   C O N T A I N E R */
    .form__inputs__container{
        width: 380px;
    }

    /* F O R M ' S   I N P U T S */
    .form__input{
        background: #F5F5F5;
        padding: 15px 25px;
        width: 100%;
        border: none;
        border-radius: 5px;
    }

    /* F O R M ' S   I N P U T S   P L A C E H O L D E R */
    ::-webkit-input-placeholder { /* WebKit, Blink, Edge */
        font-size: 11px;
        color: #C4C4C4;
    }
    :-moz-placeholder { /* Mozilla Firefox 4 to 18 */
        font-size: 11px;
        color: #C4C4C4;
        opacity:  0.5;
    }
    ::-moz-placeholder { /* Mozilla Firefox 19+ */
        font-size: 11px;
        color: #C4C4C4;
        opacity:  0.5;
    }
    :-ms-input-placeholder { /* Internet Explorer 10-11 */
        font-size: 11px;
        color: #C4C4C4;
    }
    ::-ms-input-placeholder { /* Microsoft Edge */
        font-size: 11px;
        color: #C4C4C4;
    }
    ::placeholder { /* Most modern browsers support this now. */
        font-size: 11px;
        color: #C4C4C4;
    }

    /* F O R G O T   P A S S W O R D */
    .forgot__password{
        color: #C4C4C4;
        font-size: 11px;
    }

    /* F O R M ' S   B U T T O N S */
    .form__button{
        font-size: 11px;
    }

    /* T E R M   O F   U S E ,   P R I V A C Y   P O L I C Y */
    .form__footer{
        font-size: 11px;
    }
</style>