<template>
    <div>
        <div class="left__side w-50 float-left"></div>
        <div class="right__ride w-50 pt-0 float-right">
            <div class="signup__form text-center pt-3">
                <h2 class="font-weight-bold">Hello, Friends!</h2>
                <h6 class="form__title2 mx-auto py-1">
                    Please complete to create your account
                </h6>
                <b-form class="form__inputs__container mx-auto pt-3 mb-2">
                    <b-form-group class="form__group d-flex flex-row">
                        <input type="text" name="firstname" placeholder="Firstname" class="form__input form__group__input mr-3">
                        <input type="text" name="lastname" placeholder="Lastname" class="form__input form__group__input ml-3">
                    </b-form-group>
                    <input type="text" name="username" placeholder="Username" class="form__input">
                    <input type="email" name="email" placeholder="Email address" class="form__input">
                    <input type="password" name="password1" placeholder="Password" class="form__input">
                    <input type="password" name="password2" placeholder="Confirm password" class="form__input">
                    <div class="d-flex flex-row p-0 mb-3">
                        <input id="agreement" type="checkbox" name="agreement" class="cursor__pointer my-0 mr-4">
                        <label class="form__checkbox__label main__blue__color cursor__pointer my-0 pb-1" for="agreement">I agree with terms and conditions</label>
                    </div>
                    <router-link to="/chats" :href="myPath+'/chats'" class="text-light">
                        <b-button variant="primary" class="main__blue__background form__button w-100 p-3">
                            Sign up
                        </b-button>
                    </router-link>
                </b-form>
                <router-link to="/" :href="myPath+'/'" class="signin__form__link main__blue__color">Already have an account? Sign in</router-link>
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
        name: "SignUp",
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

    /* C U R S O R   P O I N T E R */
    .cursor__pointer{
        cursor: pointer;
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
    .signup__form{
        height: 100%;
    }

    /* F O R M ' S   T I T L E   T W O */
    .form__title2{
        font-size: 11px;
        width: 210px;
    }

    /* F O R M   I N P U T   C O N T A I N E R */
    .form__inputs__container{
        width: 360px;
    }

    /* F O R M   I N P U T */
    .form__input{
        background: #F5F5F5;
        border-radius: 5px;
        height: 7vh;
        border: none;
        padding: 0 20px;
        margin: 0 0 20px 0;
        width: 100%;
    }

    /* F O R M   I N P U T   F I R S T A M E   A N D   L A S T N A M E */
    .form__group__input{
        width: 160px;
        margin: 0;
    }

    /* F O R M   I N P U T   C H E C K B O X   L A B E L */
    .form__checkbox__label{
        font-size: 11px;
    }

    /* F O R M   I N P U T   C H E C K B O X */
    input[type=checkbox]{
        width: 15px;
        height: 15px;
        border-radius: 2px;
    }

    /* F O R M ' S   B U T T O N S */
    .form__button{
        font-size: 11px;
        font-weight: bold;
    }

    /* S I G N   I N   F O R M   L I N K */
    .signin__form__link{
        font-size: 11px;
    }

    /* T E R M   O F   U S E ,   P R I V A C Y   P O L I C Y */
    .form__footer{
        font-size: 11px;
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
</style>