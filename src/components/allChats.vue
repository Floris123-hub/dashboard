<template>
    <div>

        <!-- *********************************************************** C H A T S ******************************************************** -->

        <div id="all__chats" class="border-right float-left bg-white">

            <!-- ****************************************************** C H A N N E L S *************************************************** -->

            <div id="sidebar__left__side" class="border-right d-flex flex-column float-left pt-4 position-fixed">
                <div id="chat__channels__box" class="d-flex flex-column justify-content-around mt-5">
                    <div v-for="(channel, index) in getChannels.channels" :key="index">
                        <b-badge variant="danger" class="channel__badge rounded-circle px-0 position-relative border border-light">{{channeDiscussionsCount(channel.chan.idChannel)}}</b-badge>
                        <div :id="channel.chan.idChannel" v-html="channel.chan.iconSVG" class="cursor__pointer px-3 toggleActive" @click="activateCurrent(channel.chan.idChannel), toggleGroup(channel.chan.idChannel), sortArg=channel.chan.idChannel"></div>
                        <b-popover :target="channel.chan.idChannel" triggers="hover" placement="right" variant="dark">
                            {{channel.chan.popoverText}}
                        </b-popover>
                    </div>
                </div>
            </div>


            <div id="sidebar__right__side" class="d-flex flex-column pl-2">

                <!-- ****************************************************** S E A R C H B A R *************************************************** -->

                <div class="searchbar__box pb-2 bg-white mx-0 pt-3">
                    <b-input-group>
                        <template #prepend class="search__icon">
                            <i  class="far fa-search mr-4"></i>
                        </template>
                        <input type="search" placeholder="Rechercher des conversations ..." class="border-0" v-model="discussionName" @keyup="sortArg='search'">
                    </b-input-group>
                </div>

                <!-- ******************************************************* S T A T U S ****************************************************** -->

                <div class="status__box bg-white border-top border-bottom d-flex flex-row justify-content-between px-2">
                    <span v-for="(status, index) in getStatus.status" :key="index">
                        <div :class="isActiveStatus(status.stat.id) ? 'cursor__pointer border__active' : 'cursor__pointer'" @click="sortArg='status', currentStatus=status.stat.id">
                            <span class="status__title font-weight-bold">{{ status.stat.title }}</span>
                            <b-badge class="status__title__badge rounded-circle ml-1 pt-1" :style="'background:'+status.stat.badgeColor+';'">{{ statusBadgeCount(status.stat.id) }}</b-badge>
                        </div>
                    </span>
                </div>

                <!-- **************************************************** D I S C U S S I O N S *************************************************** -->

                <div class="all__discussions pt-3 ml-2">
                    <div :key="index" v-for="(chat, index) in sortify(sortArg)">
                        <div :class="isActive(chat.chat.fullname) ? 'cursor__pointer discussion__box border__active d-flex flex-row pt-2' : 'cursor__pointer discussion__box d-flex flex-row pt-2'" @click="chatId=chat.chat.fullname, chat.chat.opened = true, active=chat.chat.fullname">
                            <div>
                                <b-img class="discussion__profile ml-2" width="50" height="50" rounded="circle" :src="chat.chat.profileImage"></b-img>
                                <div class="group__badge position-relative rounded-circle" v-html="chat.chat.channelBadge"></div>
                            </div>
                            <div class="discussion__name__message ml-4 d-flex flex-column justify-content-between pb-3">
                                <div class="discussion__name font-weight-bold">
                                    {{chat.chat.name.firstname}} {{chat.chat.name.lastname}}
                                </div>
                                <div :class="chat.chat.opened ? 'text__muted discussion__message' : 'discussion__message'">
                                    {{chat.chat.messages.slice(-1).pop().text.split(" ").splice(0, 5).join(" ")}}
                                </div>
                            </div>
                            <div class="discussion__date__badge d-flex flex-column justify-content-between ml-auto mb-2 text-right">
                                <div class="discussion__date font-weight-light">
                                    {{chat.chat.messages.slice(-1).pop().date.split(" ").splice(0, 1).join().substring(0,3)}}
                                </div>
                                <b-badge class="discussion__badge border d-flex flex-column justify-content-around p-0 mb-3 ml-auto rounded-circle" :style="chat.chat.opened ? 'background: #DBDBDB' : 'background:' + chat.chat.badgeColor">
                                    +{{chat.chat.messages.length}}
                                </b-badge>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="chat__zone" v-if="chatId !== null">
            <div v-for="(chat, index) in chatData" :key="index">

                <!-- ****************************************************** H E A D E R *************************************************** -->

                <div class="chat__zone__header border-bottom d-flex flex-row justify-content-between px-4">
                    <div class="header__user__status d-flex flex-row py-1">
                        <b-img height="35" width="35" rounded="circle" :src="chat.profileImage"></b-img>
                        <div class="pl-2 d-flex flex-column justify-content-evenly">
                            <span class="user__fullname ">{{ chat.fullname }}</span>
                            <span class="user__status ">Inactif</span>
                        </div>
                    </div>
                    <div class="header__chat__options py-3 pr-1 d-flex flex-row">
                        <i class="option__icon cursor__pointer fal fa-clock mx-2" @click="chat.history=!chat.history"></i>
                        <i class="option__icon cursor__pointer fal fa-check-circle mx-2"></i>
                        <i class="option__icon cursor__pointer fal fa-trash-alt mx-2"></i>
                    </div>
                </div>

                <!-- *************************************************** C H A T   Z O N E ************************************************* -->

                <div class="chat__zone__container d-flex flex-row">

                    <span class="w-100 d-flex flex-column">

                        <!-- ******************************************* I N V I T A T I O N   F R A M E ****************************************** -->

                        <span v-if="chat.friend === false">
                            <div class="invitation__frame d-flex flex-column mx-auto justify-content-between">
                                <div class="d-flex">
                                    <b-img class="mx-auto" height="50" width="50" rounded="circle" :src="chat.profileImage"></b-img>
                                </div>
                                <div class="text-center">
                                    <h6 class="invitation__paragraph">Hey, friends I would like to add you as contact</h6>
                                    <h6 class="invitation__paragraph">{{chat.name.firstname}} would like to add you as contact</h6>
                                </div>
                                <div class="d-flex flex-row justify-content-center">
                                    <button class="decision__button decision__accept btn btn-primary border-0 rounded-circle mx-2" @click="chat.friend = true">
                                        <i class="fal fa-check"></i>
                                    </button>
                                    <button class="decision__button decision__reject btn btn-danger border-0 rounded-circle  mx-2" @click=" chat.friend = false">
                                        <i class="fal fa-times"></i>
                                    </button>
                                </div>
                            </div>
                        </span>

                        <!-- ******************************************* M E S S A G E S   F R A M E ****************************************** -->

                        <span v-else>
                            <div class="messages__frame d-flex flex-column pt-2">
                                <span v-for="(message, index) in chat.messages" :key="index">
                                    <span v-if="message.author === 'Me'">
                                        <div class="chat__message float-right mr-4 mt-2">
                                            <div class="message__right px-3 py-2">
                                                {{message.text}}
                                            </div>
                                            <h6 class="message__hour float-right mt-2">
                                                <i class="fas fa-check mr-1"></i>
                                                {{ message.date.split(' ').splice(4).join().replace(',', ' ').substring(0, 5) }}
                                            </h6>
                                        </div>
                                    </span>
                                    <span v-if="message.author === 'You'">
                                        <div class="chat__message ml-5 pl-5 float-left">
                                            <div class="message__left  px-3 py-2">
                                                {{message.text}}
                                            </div>
                                            <h6 class="message__hour mt-2">
                                                {{ message.date.split(' ').splice(4).join().replace(',', ' ').substring(0, 5) }}
                                            </h6>
                                            <b-img height="40" width="40" rounded="circle" :src="chat.profileImage" class="chat__img position-relative"></b-img>
                                        </div>
                                    </span>
                                </span>
                            </div>
                        </span>

                        <!-- **************************** T E X T   -   R E S P O N S E   -   E M O T I C O N S *********************************** -->

                        <picker style="z-index: 99;" class="mt-4 ml-4 position-absolute" v-show="showEmojiPicker" title="Pick your emoji..." emoji="point_up" @select="addEmoji"/>
                        <span class="message__mode bg-white position-absolute d-flex flex-column">
                            <span v-if="modeID === 'rep'" class="border-bottom d-flex flex-row justify-content-between pb-2">
                                <span v-for="(rep, index) in responses" :key="index">
                                    <span class="font__12 text__blue btn btn-outline-primary border font-weight-bold mx-1 px-2 py-2" @click="send(rep.rep, chat.fullname)">{{rep.rep}}</span>
                                </span>
                            </span>
                            <span class="d-flex flex-row ml-5">
                                <span>
                                    <span :class="activeMode('txt') ? '__mode font__12 cursor__pointer mx-2 font-weight-bold text__blue border__active px-1' : '__mode font__12 cursor__pointer mx-2 font-weight-bold text__muted'" @click="modeID = 'txt'">Texte</span>
                                    <span :class="activeMode('rep') ? '__mode font__12 cursor__pointer mx-2 font-weight-bold text__blue border__active px-1' : '__mode font__12 cursor__pointer mx-2 font-weight-bold text__muted'" @click="modeID = 'rep'">Réponses</span>
                                    <span :class="{ 'triggered': showEmojiPicker }" @click="toggleEmojiPicker">
                                        <span :class="activeMode('emo') ? '__mode font__12 cursor__pointer mx-2 font-weight-bold text__blue border__active px-1' : '__mode font__12 cursor__pointer mx-2 font-weight-bold text__muted'" @click="modeID = 'emo'">Émoticones</span>
                                    </span>
                                </span>
                            </span>
                        </span>

                        <!-- ************************************** T Y P I N G   M E S S A G E   Z O N E ************************************** -->

                        <!--<input id="file" ref="file" type="file" name="file" hidden>-->
                        <div class="text__zone bg-white mt-auto py-4 px-4 d-flex flex-row">
                            <div class="text__zone__textarea">
                                <b-input-group class="textarea__typing pb-2 h-100 d-flex flex-row">
                                    <template #prepend>
                                        <svg :class="{ 'triggered': showEmojiPicker }" @click="toggleEmojiPicker" class="cursor__pointer pt-2 my-2 ml-4" width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M12.5 0C5.60751 0 0 5.60751 0 12.5C0 19.3925 5.60751 25 12.5 25C19.3925 25 25 19.3925 25 12.5C25 5.60751 19.3926 0 12.5 0ZM12.5 23.6486C9.4378 23.6486 6.66014 22.4074 4.64331 20.402C3.83789 19.6011 3.15418 18.6781 2.62183 17.6638C1.811 16.1191 1.35137 14.3623 1.35137 12.5C1.35137 6.35262 6.35262 1.35137 12.5 1.35137C15.4158 1.35137 18.0733 2.47706 20.062 4.31611C21.0931 5.2695 21.9446 6.41444 22.5585 7.69419C23.257 9.15021 23.6486 10.7802 23.6486 12.5C23.6486 18.6474 18.6474 23.6486 12.5 23.6486Z" fill="#C4C4C4"/>
                                            <path d="M16.5818 11.0642C17.3282 11.0642 17.9332 10.4591 17.9332 9.71279C17.9332 8.96645 17.3282 8.36142 16.5818 8.36142C15.8355 8.36142 15.2305 8.96645 15.2305 9.71279C15.2305 10.4591 15.8355 11.0642 16.5818 11.0642Z" fill="#C4C4C4"/>
                                            <path d="M8.22051 11.0642C8.96685 11.0642 9.57188 10.4591 9.57188 9.71279C9.57188 8.96645 8.96685 8.36142 8.22051 8.36142C7.47417 8.36142 6.86914 8.96645 6.86914 9.71279C6.86914 10.4591 7.47417 11.0642 8.22051 11.0642Z" fill="#C4C4C4"/>
                                            <path d="M12.4754 19.4255C15.0898 19.4255 17.5953 18.0885 19.0299 15.8686L17.8948 15.1352C16.5775 17.1736 14.1679 18.3112 11.7551 18.0328C9.87488 17.816 8.13609 16.7327 7.10373 15.1352L5.96875 15.8686C7.21792 17.8018 9.32319 19.1127 11.6002 19.3753C11.8926 19.409 12.1845 19.4255 12.4754 19.4255Z" fill="#C4C4C4"/>
                                        </svg>
                                    </template>
                                    <textarea ref="textarea" rows="1" cols="91" class="message__area border-0 mt-2 pt-2 ml-2 mr-auto" v-model="message" placeholder="Tapez votre message ici..."></textarea>
                                    <template #append>
                                        <svg class="cursor__pointer pt-2 my-2 mr-3" width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg" @click="send(message, chat.fullname)">
                                            <path d="M0 23.2143L25 12.5L0 1.78571V10.119L17.8571 12.5L0 14.8809V23.2143Z" fill="#C4C4C4"/>
                                        </svg>
                                    </template>
                                </b-input-group>
                            </div>
                            <div class="text__zone__send d-flex ml-4">
                                <button class="sending__button btn btn-primary rounded-circle border-0 mx-auto" onclick="document.querySelector('#file').click()">
                                    <svg width="25" height="26" viewBox="0 0 25 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M22.936 2.16856C21.4806 0.802972 19.5681 0.0296642 17.5726 0C15.573 0.00869327 13.653 0.784987 12.2093 2.16856C12.0533 2.33668 11.9326 2.53436 11.8543 2.74992C11.776 2.96548 11.7417 3.19455 11.7534 3.42359C11.7831 3.87672 11.9413 4.31203 12.2093 4.67862C12.3774 4.83461 12.5751 4.95533 12.7906 5.03363C13.0062 5.11194 13.2353 5.14624 13.4643 5.13452C13.9179 5.10558 14.3538 4.94805 14.7211 4.68035C15.5176 3.91191 16.5811 3.48249 17.6879 3.48249C18.7946 3.48249 19.8582 3.91191 20.6547 4.68035C21.2953 5.496 21.6553 6.4968 21.6809 7.53363C21.6803 8.08675 21.569 8.63415 21.3534 9.14355C21.1379 9.65294 20.8225 10.114 20.4259 10.4996L10.4984 20.4254C9.70187 21.1938 8.63829 21.6233 7.53154 21.6233C6.42478 21.6233 5.36121 21.1938 4.56471 20.4254C3.84342 19.6489 3.43684 18.6318 3.4241 17.5721C3.42493 17.0189 3.53657 16.4714 3.75241 15.962C3.96826 15.4526 4.28395 14.9916 4.68086 14.6062L8.9001 10.3834C9.13084 10.1639 9.43711 10.0415 9.75557 10.0415C10.074 10.0415 10.3803 10.1639 10.611 10.3834C10.8319 10.6362 10.9537 10.9604 10.9537 11.2961C10.9537 11.6318 10.8319 11.9561 10.611 12.2088L7.5324 15.2909C7.37641 15.459 7.25569 15.6567 7.17738 15.8722C7.09908 16.0878 7.06478 16.3169 7.0765 16.5459C7.10627 16.999 7.26439 17.4343 7.5324 17.8009C7.87033 18.0775 8.29355 18.2286 8.73022 18.2286C9.1669 18.2286 9.59012 18.0775 9.92805 17.8009L13.0015 14.7206C13.879 13.8429 14.372 12.6525 14.372 11.4114C14.372 10.1702 13.879 8.97991 13.0015 8.1022C12.5724 7.66476 12.0596 7.3181 11.4938 7.08284C10.928 6.84758 10.3207 6.72853 9.7079 6.73277C9.11599 6.69546 8.52311 6.78852 7.97109 7.00537C7.41907 7.22222 6.92138 7.55759 6.51313 7.9878L2.28348 12.2088C1.55208 12.8958 0.971454 13.7273 0.578448 14.6506C0.185442 15.5738 -0.0113677 16.5687 0.000507074 17.5721C0.00920034 19.5718 0.785494 21.4917 2.16907 22.9354C3.62438 24.301 5.53694 25.0743 7.5324 25.104C9.53205 25.0953 11.452 24.319 12.8957 22.9354L22.8215 13.001C23.5277 12.3021 24.0842 11.4668 24.457 10.5459C24.8298 9.62503 25.0112 8.63785 24.9901 7.64457C25.0334 6.6406 24.8738 5.6382 24.5209 4.69732C24.1679 3.75643 23.6289 2.89637 22.936 2.16856Z" fill="white"/>
                                    </svg>
                                </button>
                                
                            </div>
                        </div>
                    </span>

                    <!-- ************************************** C H A T   D E T A I L S ************************************** -->

                    <span v-if="chat.history" class="chat__details bg-white border-left d-flex flex-column">

                        <!-- ************************************** U S E R   I N F O S ************************************** -->

                        <span class="person__details border-bottom d-flex flex-row">
                            <b-img height="30" width="30" class="mx-auto mt-2" rounded="circle" :src="chat.profileImage"></b-img>
                            <span class="user__contact d-flex flex-column pt-2">
                                <strong class="contact__fullname">{{chat.fullname}}</strong>
                                <span class="contact__number font-weight-bold">{{chat.tel}}</span>
                                <span class="contact__email font-weight-bold">{{chat.mail}}</span>
                            </span>
                        </span>

                        <!-- ************************************** H I S T O R Y ************************************** -->

                        <span class="person__history border-bottom d-flex flex-column p-2">
                            <strong class="history__title__link">
                                <span class="mr-2">Historique</span>
                                <i class="far fa-external-link"></i>
                            </strong>
                            <span class="history__datetime__badge d-flex flex-row mt-2">
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M11.5772 8.92212L8.93335 6.09589L3.01172 12.5298L8.42203 10.6953L11.0659 13.5216L16.9876 7.08771L11.5772 8.92212ZM11.0589 11.7989L8.76154 9.34296L6.98236 9.94614L8.94037 7.81876L11.2379 10.2747L13.0169 9.67148L11.0589 11.7989Z" fill="#43425D"/>
                                    <path d="M17.0593 2.76779C15.172 0.982971 12.6649 0 10 0C7.33505 0 4.82803 0.982971 2.94067 2.76779C1.04431 4.56116 0 6.94809 0 9.48883C0 12.2346 1.23825 14.8192 3.40775 16.6241V20L6.50085 18.3798C7.61932 18.7767 8.79501 18.9777 10 18.9777C12.6649 18.9777 15.172 17.9947 17.0593 16.2099C18.9557 14.4165 20 12.0296 20 9.48883C20 6.94809 18.9557 4.56116 17.0593 2.76779ZM10 17.8058C8.84872 17.8058 7.72827 17.5996 6.66962 17.193L6.42242 17.0981L4.57962 18.0632V16.0593L4.35532 15.8833C2.33215 14.2963 1.17188 11.9655 1.17188 9.48883C1.17188 4.9028 5.13214 1.17188 10 1.17188C14.8679 1.17188 18.8281 4.9028 18.8281 9.48883C18.8281 14.0749 14.8679 17.8058 10 17.8058Z" fill="#43425D"/>
                                </svg>
                                <span class="font__10 d-flex flex-column ml-3">
                                    <span>28 - 06 - 19 à 09:23:04</span>
                                    <b-badge  class="__badge font__10 text__gray bg__gray rounded-pill px-2 py-1 mt-1">Finalisation enregistrement</b-badge>
                                </span>
                            </span>
                            <span class="history__datetime__badge d-flex flex-row mt-2">
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M11.5772 8.92212L8.93335 6.09589L3.01172 12.5298L8.42203 10.6953L11.0659 13.5216L16.9876 7.08771L11.5772 8.92212ZM11.0589 11.7989L8.76154 9.34296L6.98236 9.94614L8.94037 7.81876L11.2379 10.2747L13.0169 9.67148L11.0589 11.7989Z" fill="#43425D"/>
                                    <path d="M17.0593 2.76779C15.172 0.982971 12.6649 0 10 0C7.33505 0 4.82803 0.982971 2.94067 2.76779C1.04431 4.56116 0 6.94809 0 9.48883C0 12.2346 1.23825 14.8192 3.40775 16.6241V20L6.50085 18.3798C7.61932 18.7767 8.79501 18.9777 10 18.9777C12.6649 18.9777 15.172 17.9947 17.0593 16.2099C18.9557 14.4165 20 12.0296 20 9.48883C20 6.94809 18.9557 4.56116 17.0593 2.76779ZM10 17.8058C8.84872 17.8058 7.72827 17.5996 6.66962 17.193L6.42242 17.0981L4.57962 18.0632V16.0593L4.35532 15.8833C2.33215 14.2963 1.17188 11.9655 1.17188 9.48883C1.17188 4.9028 5.13214 1.17188 10 1.17188C14.8679 1.17188 18.8281 4.9028 18.8281 9.48883C18.8281 14.0749 14.8679 17.8058 10 17.8058Z" fill="#43425D"/>
                                </svg>
                                <span class="font__10 d-flex flex-column ml-3">
                                    <span>28 - 06 - 19 à 09:23:04</span>
                                    <b-badge  class="__badge font__10 text__gray bg__gray rounded-pill px-2 py-1 mt-1">Y'ello care</b-badge>
                                </span>
                            </span>
                            <span class="history__datetime__badge d-flex flex-row mt-2">
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M11.5772 8.92212L8.93335 6.09589L3.01172 12.5298L8.42203 10.6953L11.0659 13.5216L16.9876 7.08771L11.5772 8.92212ZM11.0589 11.7989L8.76154 9.34296L6.98236 9.94614L8.94037 7.81876L11.2379 10.2747L13.0169 9.67148L11.0589 11.7989Z" fill="#43425D"/>
                                    <path d="M17.0593 2.76779C15.172 0.982971 12.6649 0 10 0C7.33505 0 4.82803 0.982971 2.94067 2.76779C1.04431 4.56116 0 6.94809 0 9.48883C0 12.2346 1.23825 14.8192 3.40775 16.6241V20L6.50085 18.3798C7.61932 18.7767 8.79501 18.9777 10 18.9777C12.6649 18.9777 15.172 17.9947 17.0593 16.2099C18.9557 14.4165 20 12.0296 20 9.48883C20 6.94809 18.9557 4.56116 17.0593 2.76779ZM10 17.8058C8.84872 17.8058 7.72827 17.5996 6.66962 17.193L6.42242 17.0981L4.57962 18.0632V16.0593L4.35532 15.8833C2.33215 14.2963 1.17188 11.9655 1.17188 9.48883C1.17188 4.9028 5.13214 1.17188 10 1.17188C14.8679 1.17188 18.8281 4.9028 18.8281 9.48883C18.8281 14.0749 14.8679 17.8058 10 17.8058Z" fill="#43425D"/>
                                </svg>
                                <span class="font__10 d-flex flex-column ml-3">
                                    <span>28 - 06 - 19 à 09:23:04</span>
                                    <b-badge  class="__badge font__10 text__gray bg__gray rounded-pill px-2 py-1 mt-1">Enregistrement</b-badge>
                                </span>
                            </span>
                        </span>

                        <!-- ************************************** D E T A I L S ************************************** -->

                        <span class="border-bottom d-flex flex-column px-2">
                            <strong class="font__11 mb-1">Détails</strong>
                            <span class="font__11 mb-1">
                                <strong>Date: </strong>
                                <span class="text__gray">20 - 10 -19 à 10:29:03</span>
                            </span>
                            <span class="font__11 mb-1">
                                <strong>Réponse: </strong>
                                <span class="text__gray">20 - 10 -19 à 10:29:03</span>
                            </span>
                            <span class="font__11 mb-1">
                                <strong>Durée: </strong>
                                <span class="text__gray">20 minutes</span>
                            </span>
                            <span class="font__11 mb-1">
                                <strong>Attente: </strong>
                                <span class="text__gray">6 minutes</span>
                            </span>
                        </span>

                        <!-- ************************************** S E T T I N G S ************************************** -->

                        <span class="d-flex flex-column m-2 h-100 justify-content-between">
                            <span class="cursor__pointer d-flex flex-row mb-1">
                                <svg class="pt-1 mr-2" width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12.4093 13.4707C12.4352 13.4707 12.4611 13.4707 12.4921 13.4707C12.5025 13.4707 12.5128 13.4707 12.5232 13.4707C12.5387 13.4707 12.5594 13.4707 12.575 13.4707C14.0918 13.4448 15.3188 12.9116 16.2248 11.8917C18.2179 9.64485 17.8866 5.79313 17.8504 5.42555C17.7209 2.66618 16.4163 1.34603 15.3395 0.729965C14.5371 0.269207 13.6 0.0207082 12.5542 0H12.518C12.5128 0 12.5025 0 12.4973 0H12.4662C11.8916 0 10.763 0.093187 9.68098 0.709257C8.5938 1.32533 7.26847 2.64548 7.13905 5.42555C7.10281 5.79313 6.77148 9.64485 8.76464 11.8917C9.66545 12.9116 10.8924 13.4448 12.4093 13.4707ZM8.52132 5.55498C8.52132 5.53945 8.5265 5.52392 8.5265 5.51356C8.69734 1.80162 11.3325 1.40298 12.4611 1.40298H12.4818C12.4921 1.40298 12.5076 1.40298 12.5232 1.40298C13.921 1.43404 16.2973 2.00352 16.4577 5.51356C16.4577 5.5291 16.4577 5.54463 16.4629 5.55498C16.4681 5.59122 16.8305 9.11162 15.1842 10.965C14.5319 11.7001 13.6621 12.0625 12.518 12.0729C12.5076 12.0729 12.5025 12.0729 12.4921 12.0729C12.4818 12.0729 12.4766 12.0729 12.4662 12.0729C11.3273 12.0625 10.4524 11.7001 9.80523 10.965C8.1641 9.12197 8.51614 5.58604 8.52132 5.55498Z" fill="#C4C4C4"/>
                                    <path d="M23.1308 19.8592C23.1308 19.854 23.1308 19.8488 23.1308 19.8436C23.1308 19.8022 23.1256 19.7608 23.1256 19.7142C23.0945 18.6892 23.0272 16.2922 20.7804 15.526C20.7648 15.5208 20.7441 15.5156 20.7286 15.5104C18.3938 14.9151 16.4524 13.569 16.4317 13.5535C16.1159 13.3309 15.681 13.4086 15.4584 13.7244C15.2358 14.0402 15.3134 14.475 15.6292 14.6976C15.7172 14.7598 17.7777 16.1938 20.3559 16.8565C21.5621 17.2862 21.6967 18.5753 21.733 19.7556C21.733 19.8022 21.733 19.8436 21.7381 19.8851C21.7433 20.351 21.7122 21.0706 21.6294 21.4848C20.7907 21.9611 17.5033 23.6074 12.5023 23.6074C7.52194 23.6074 4.2138 21.9559 3.36994 21.4796C3.28711 21.0654 3.25087 20.3458 3.26122 19.8799C3.26122 19.8385 3.2664 19.797 3.2664 19.7505C3.30264 18.5701 3.43724 17.281 4.6435 16.8513C7.22167 16.1886 9.28214 14.7494 9.37015 14.6925C9.68595 14.4699 9.76361 14.035 9.54099 13.7192C9.31838 13.4034 8.88351 13.3257 8.56771 13.5483C8.547 13.5639 6.61596 14.9099 4.27075 15.5053C4.25004 15.5104 4.23451 15.5156 4.21898 15.5208C1.97214 16.2922 1.90484 18.6892 1.87377 19.709C1.87377 19.7556 1.87377 19.797 1.8686 19.8385C1.8686 19.8436 1.8686 19.8488 1.8686 19.854C1.86342 20.1232 1.85824 21.5055 2.13263 22.1992C2.1844 22.3338 2.27758 22.4477 2.40183 22.5254C2.55715 22.6289 6.27945 25 12.5074 25C18.7354 25 22.4577 22.6237 22.6131 22.5254C22.7321 22.4477 22.8305 22.3338 22.8823 22.1992C23.1411 21.5107 23.1359 20.1284 23.1308 19.8592Z" fill="#C4C4C4"/>
                                </svg>
                                <span class="font__11 d-flex flex-column">
                                    <strong class="font__11">Mon compte</strong>
                                    <span class="text__gray font-weight-bold">Mettre à jour le profil</span>
                                </span>
                                <svg class="my-auto ml-auto" width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1 1L6 6L1 11" stroke="black" stroke-width="2"/>
                                </svg>
                            </span>

                            <span class="cursor__pointer d-flex flex-row mb-1">
                                <svg class="pt-1 mr-2" width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M16.2138 0H2.70801V25H22.2913V6.0775L16.2138 0ZM16.458 1.4225L20.8688 5.83333H16.458V1.4225ZM3.54134 24.1667V0.833333H15.6247V6.66667H21.458V24.1667H3.54134Z" fill="#C4C4C4"/>
                                    <path d="M6.87467 7.08333H10.6247C10.8547 7.08333 11.0413 6.89708 11.0413 6.66667C11.0413 6.43625 10.8547 6.25 10.6247 6.25H6.87467C6.64467 6.25 6.45801 6.43625 6.45801 6.66667C6.45801 6.89708 6.64467 7.08333 6.87467 7.08333Z" fill="#C4C4C4"/>
                                    <path d="M13.958 15.4167H6.87467C6.64467 15.4167 6.45801 15.6029 6.45801 15.8333C6.45801 16.0638 6.64467 16.25 6.87467 16.25H13.958C14.188 16.25 14.3747 16.0638 14.3747 15.8333C14.3747 15.6029 14.188 15.4167 13.958 15.4167Z" fill="#C4C4C4"/>
                                    <path d="M18.1243 12.5H15.2077C14.9777 12.5 14.791 12.6863 14.791 12.9167C14.791 13.1471 14.9777 13.3333 15.2077 13.3333H18.1243C18.3543 13.3333 18.541 13.1471 18.541 12.9167C18.541 12.6863 18.3543 12.5 18.1243 12.5Z" fill="#C4C4C4"/>
                                    <path d="M6.87467 10.4167H8.95801C9.18801 10.4167 9.37467 10.2304 9.37467 9.99999C9.37467 9.76958 9.18801 9.58333 8.95801 9.58333H6.87467C6.64467 9.58333 6.45801 9.76958 6.45801 9.99999C6.45801 10.2304 6.64467 10.4167 6.87467 10.4167Z" fill="#C4C4C4"/>
                                    <path d="M13.1247 10.4167H16.0413C16.2713 10.4167 16.458 10.2304 16.458 9.99999C16.458 9.76958 16.2713 9.58333 16.0413 9.58333H13.1247C12.8947 9.58333 12.708 9.76958 12.708 9.99999C12.708 10.2304 12.8947 10.4167 13.1247 10.4167Z" fill="#C4C4C4"/>
                                    <path d="M10.625 9.99999C10.625 10.1083 10.6708 10.2167 10.7458 10.2958C10.825 10.3708 10.9333 10.4167 11.0417 10.4167C11.15 10.4167 11.2583 10.3708 11.3375 10.2958C11.4125 10.2167 11.4583 10.1083 11.4583 9.99999C11.4583 9.89124 11.4125 9.78291 11.3375 9.70416C11.1833 9.54999 10.9042 9.54999 10.7458 9.70416C10.6708 9.78291 10.625 9.89124 10.625 9.99999Z" fill="#C4C4C4"/>
                                    <path d="M8.95768 12.5C8.72768 12.5 8.54102 12.6863 8.54102 12.9167C8.54102 13.1471 8.72768 13.3333 8.95768 13.3333H13.1243C13.3543 13.3333 13.541 13.1471 13.541 12.9167C13.541 12.6863 13.3543 12.5 13.1243 12.5H8.95768Z" fill="#C4C4C4"/>
                                    <path d="M6.87467 13.3333C6.98301 13.3333 7.09134 13.2875 7.17051 13.2125C7.24551 13.1333 7.29134 13.025 7.29134 12.9167C7.29134 12.8079 7.24551 12.6996 7.17051 12.6208C7.01634 12.4667 6.73301 12.4667 6.57884 12.6208C6.50384 12.6996 6.45801 12.8037 6.45801 12.9167C6.45801 13.025 6.50384 13.1333 6.57884 13.2125C6.65801 13.2875 6.76634 13.3333 6.87467 13.3333Z" fill="#C4C4C4"/>
                                    <path d="M18.1243 18.3333H15.2077C14.9777 18.3333 14.791 18.5196 14.791 18.75C14.791 18.9804 14.9777 19.1667 15.2077 19.1667H18.1243C18.3543 19.1667 18.541 18.9804 18.541 18.75C18.541 18.5196 18.3543 18.3333 18.1243 18.3333Z" fill="#C4C4C4"/>
                                    <path d="M13.1243 18.3333H8.95768C8.72768 18.3333 8.54102 18.5196 8.54102 18.75C8.54102 18.9804 8.72768 19.1667 8.95768 19.1667H13.1243C13.3543 19.1667 13.541 18.9804 13.541 18.75C13.541 18.5196 13.3543 18.3333 13.1243 18.3333Z" fill="#C4C4C4"/>
                                    <path d="M6.57884 18.4542C6.50384 18.5292 6.45801 18.6371 6.45801 18.75C6.45801 18.8625 6.49967 18.9667 6.57884 19.0458C6.65801 19.1208 6.76634 19.1667 6.87467 19.1667C6.98717 19.1667 7.09134 19.1208 7.17051 19.0458C7.24551 18.9667 7.29134 18.8583 7.29134 18.75C7.29134 18.6371 7.24551 18.5329 7.17051 18.4583C7.01634 18.3 6.73717 18.3 6.57884 18.4542Z" fill="#C4C4C4"/>
                                    <path d="M17.8288 9.70416C17.7538 9.78291 17.708 9.89124 17.708 9.99999C17.708 10.1083 17.7538 10.2167 17.8288 10.2958C17.908 10.3708 18.0163 10.4167 18.1247 10.4167C18.233 10.4167 18.3413 10.3708 18.4205 10.2958C18.4997 10.2167 18.5413 10.1083 18.5413 9.99999C18.5413 9.89124 18.4997 9.78291 18.4205 9.70416C18.2622 9.54999 17.9872 9.54999 17.8288 9.70416Z" fill="#C4C4C4"/>
                                    <path d="M16.3375 16.1292C16.4125 16.05 16.4583 15.9417 16.4583 15.8333C16.4583 15.7246 16.4125 15.6163 16.3375 15.5375C16.1792 15.3833 15.9 15.3833 15.7458 15.5375C15.6708 15.6163 15.625 15.7246 15.625 15.8333C15.625 15.9417 15.6708 16.05 15.7458 16.1292C15.825 16.2079 15.9292 16.25 16.0417 16.25C16.1542 16.25 16.2583 16.2042 16.3375 16.1292Z" fill="#C4C4C4"/>
                                    <path d="M17.8288 15.5375C17.7538 15.6163 17.708 15.7246 17.708 15.8333C17.708 15.9417 17.7538 16.05 17.8288 16.1292C17.908 16.2042 18.0122 16.25 18.1247 16.25C18.2372 16.25 18.3413 16.2042 18.4205 16.1292C18.4955 16.05 18.5413 15.9417 18.5413 15.8333C18.5413 15.7246 18.4955 15.6163 18.4205 15.5375C18.2663 15.3833 17.983 15.3833 17.8288 15.5375Z" fill="#C4C4C4"/>
                                </svg>
                                <span class="font__11 d-flex flex-column">
                                    <strong class="font__11">Topics</strong>
                                    <span class="text__gray font-weight-bold">Sujets de discussion</span>
                                </span>
                                <svg class="my-auto ml-auto" width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1 1L6 6L1 11" stroke="black" stroke-width="2"/>
                                </svg>
                            </span>

                            <span class="cursor__pointer d-flex flex-row mb-1">
                                <svg class="pt-1 mr-2" width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <g clip-path="url(#clip0)">
                                        <path d="M22.8429 21.0865L21.0533 18.1052C20.2283 16.7292 19.7918 15.1542 19.7918 13.549V10.9375C19.7918 6.91772 16.5199 3.64584 12.5001 3.64584C8.48035 3.64584 5.20848 6.91772 5.20848 10.9375V13.549C5.20848 15.1542 4.772 16.7292 3.947 18.1052L2.1574 21.0865C2.06053 21.2469 2.05843 21.448 2.15013 21.6105C2.24285 21.774 2.41678 21.8751 2.60428 21.8751H22.3959C22.5834 21.8751 22.7574 21.774 22.8501 21.6105C22.9418 21.4479 22.9397 21.2469 22.8429 21.0865ZM3.5241 20.8334L4.83973 18.6406C5.76263 17.1031 6.25013 15.3427 6.25013 13.549V10.9375C6.25013 7.49062 9.05325 4.68749 12.5001 4.68749C15.947 4.68749 18.7501 7.49062 18.7501 10.9375V13.549C18.7501 15.3427 19.2376 17.1031 20.1595 18.6406L21.4762 20.8334H3.5241Z" fill="#C4C4C4"/>
                                        <path d="M12.5003 0C11.3514 0 10.417 0.934375 10.417 2.08335V4.1667C10.417 4.45415 10.6503 4.6875 10.9378 4.6875C11.2253 4.6875 11.4587 4.45415 11.4587 4.16665V2.08335C11.4587 1.50835 11.9253 1.0417 12.5003 1.0417C13.0754 1.0417 13.542 1.50835 13.542 2.08335V4.1667C13.542 4.45415 13.7754 4.6875 14.0629 4.6875C14.3504 4.6875 14.5837 4.45415 14.5837 4.16665V2.08335C14.5837 0.934375 13.6493 0 12.5003 0Z" fill="#C4C4C4"/>
                                        <path d="M14.7538 21.0906C14.607 20.8427 14.2892 20.7615 14.0403 20.9041C13.7913 21.05 13.708 21.3698 13.8538 21.6177C13.9892 21.8479 14.0632 22.1239 14.0632 22.3958C14.0632 23.2573 13.3622 23.9583 12.5007 23.9583C11.6393 23.9583 10.9382 23.2573 10.9382 22.3958C10.9382 22.1239 11.0122 21.8479 11.1476 21.6177C11.2924 21.3687 11.2091 21.0499 10.9611 20.9041C10.7101 20.7614 10.3934 20.8427 10.2476 21.0906C10.0174 21.4844 9.89551 21.9354 9.89551 22.3958C9.89556 23.8323 11.0632 25 12.4997 25C13.9362 25 15.1038 23.8323 15.1059 22.3958C15.1059 21.9354 14.9841 21.4844 14.7538 21.0906Z" fill="#C4C4C4"/>
                                    </g>
                                    <defs>
                                        <clipPath id="clip0">
                                            <rect width="25" height="25" fill="white"/>
                                        </clipPath>
                                    </defs>
                                </svg>
                                <span class="font__11 d-flex flex-column">
                                    <strong class="font__11">Notifications</strong>
                                    <span class="text__gray font-weight-bold">Activer / désactiver</span>
                                </span>
                                <svg class="my-auto ml-auto" width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1 1L6 6L1 11" stroke="black" stroke-width="2"/>
                                </svg>
                            </span>

                            <span class="cursor__pointer d-flex flex-row mb-1">
                                <svg class="pt-1 mr-2" width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12.5 0C5.59642 0 0 5.59642 0 12.5C0 19.4036 5.59642 25 12.5 25C19.4036 25 25 19.4036 25 12.5C24.9907 5.60028 19.3997 0.00926966 12.5 0ZM9.41011 1.26404C8.17261 2.43034 7.2342 3.87753 6.67416 5.48315C5.74389 5.25723 4.83287 4.95857 3.94944 4.58989C5.42395 2.99375 7.31538 1.84178 9.41011 1.26404ZM3.3764 5.25281C4.35161 5.6941 5.36285 6.05119 6.39888 6.32022C5.81236 8.18462 5.50007 10.1244 5.47191 12.0787V12.0618H0.865169C0.951756 9.58181 1.83195 7.19508 3.3764 5.25281ZM3.3764 19.7022C1.83195 17.76 0.951756 15.3732 0.865169 12.8933L5.47191 12.9045C5.49845 14.8644 5.81074 16.81 6.39888 18.6798C5.36419 18.9343 4.35309 19.2763 3.3764 19.7022ZM3.94944 20.3989V20.3652C4.83287 19.9964 5.74389 19.6978 6.67416 19.4719C7.22774 21.0937 8.16657 22.5569 9.41011 23.736C7.31412 23.1551 5.42254 21.9991 3.94944 20.3989ZM12.0787 24.118C10.191 23.8764 8.53933 22.0449 7.48876 19.3258C9.00035 19.0216 10.5369 18.8579 12.0787 18.8371V24.118ZM12.0787 17.9607C10.442 17.9815 8.81102 18.1584 7.20786 18.4888C6.64558 16.6853 6.34656 14.8102 6.32022 12.9213V12.9045H12.0787V17.9607ZM12.0787 12.0618H6.32022C6.34171 10.156 6.64073 8.26341 7.20786 6.44382C8.8099 6.78553 10.4409 6.97367 12.0787 7.00562V12.0618ZM12.0787 6.16292C10.5371 6.14382 9.00056 5.98209 7.48876 5.67977C8.53933 2.94944 10.191 1.1236 12.0787 0.882023V6.16292ZM21.6236 5.28652C23.168 7.22879 24.0482 9.61552 24.1348 12.0955H19.5281C19.5027 10.1318 19.1903 8.18237 18.6011 6.30899C19.6358 6.05449 20.6469 5.71243 21.6236 5.28652ZM21.0449 4.60112C20.1615 4.9698 19.2505 5.26847 18.3202 5.49438C17.7634 3.88525 16.8268 2.43413 15.5899 1.26404C17.6838 1.84586 19.5734 3.00176 21.0449 4.60112ZM12.9213 0.882023C14.809 1.1236 16.4607 2.95506 17.5112 5.67416C15.9996 5.97837 14.4631 6.14199 12.9213 6.16292V0.882023ZM12.9213 7.00562C14.558 6.98483 16.189 6.80801 17.7921 6.47753C18.3593 8.29712 18.6583 10.1897 18.6798 12.0955H12.9213V7.00562ZM12.9213 12.9382H18.6798C18.6583 14.844 18.3593 16.7366 17.7921 18.5562C16.1901 18.2144 14.5591 18.0263 12.9213 17.9944V12.9382ZM12.9213 24.118V18.8371C14.4629 18.8561 15.9994 19.0178 17.5112 19.3202C16.4607 22.0506 14.809 23.8764 12.9213 24.118ZM15.5899 23.736C16.8282 22.568 17.7666 21.1189 18.3258 19.5112C19.2561 19.7371 20.1671 20.0357 21.0506 20.4045C19.5768 22.0027 17.6853 23.1567 15.5899 23.736ZM21.6236 19.7472C20.6484 19.3059 19.6372 18.9487 18.6011 18.6798C19.1876 16.8154 19.4999 14.8756 19.5281 12.9213V12.9382H24.1348C24.0482 15.4182 23.168 17.8049 21.6236 19.7472Z" fill="#C4C4C4"/>
                                </svg>
                                <span class="font__11 d-flex flex-column">
                                    <strong class="font__11">Langue</strong>
                                    <span class="text__gray font-weight-bold">Choisir la langue</span>
                                </span>
                                <svg class="my-auto ml-auto" width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1 1L6 6L1 11" stroke="black" stroke-width="2"/>
                                </svg>
                            </span>

                            <span class="cursor__pointer d-flex flex-row mb-1">
                                <svg class="pt-1 mr-2" width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M20.5026 10.8948H20.1349V7.63774C20.1349 3.42792 16.7122 0 12.4972 0C8.28739 0 4.85947 3.42274 4.85947 7.63774C4.85947 8.0261 5.17016 8.33679 5.55852 8.33679C5.94688 8.33679 6.25756 8.0261 6.25756 7.63774C6.25756 4.19946 9.05375 1.39809 12.4972 1.39809C15.9355 1.39809 18.7369 4.19428 18.7369 7.63774V10.8948H4.497C3.75135 10.8948 3.14551 11.5006 3.14551 12.2463V20.9507C3.14551 23.1825 4.96303 25 7.1948 25H17.8048C20.0366 25 21.8541 23.1825 21.8541 20.9507V12.2463C21.8541 11.5006 21.2482 10.8948 20.5026 10.8948ZM20.456 20.9507C20.456 22.4109 19.2702 23.6019 17.8048 23.6019H7.19998C5.73975 23.6019 4.54878 22.4161 4.54878 20.9507V12.2929H20.456V20.9507Z" fill="#C4C4C4"/>
                                    <path d="M12.5027 20.6659C13.9474 20.6659 15.1176 19.4905 15.1176 18.051C15.1176 16.6063 13.9422 15.436 12.5027 15.436C11.058 15.436 9.8877 16.6114 9.8877 18.051C9.8877 19.4905 11.058 20.6659 12.5027 20.6659ZM12.5027 16.8289C13.1758 16.8289 13.7195 17.3778 13.7195 18.0458C13.7195 18.7138 13.1758 19.2678 12.5027 19.2678C11.8295 19.2678 11.2858 18.7189 11.2858 18.051C11.2858 17.383 11.8295 16.8289 12.5027 16.8289Z" fill="#C4C4C4"/>
                                </svg>
                                <span class="font__11 d-flex flex-column">
                                    <strong class="font__11">Confidentialité et Sécurité</strong>
                                    <span class="text__gray font-weight-bold">Terms de confidentialités</span>
                                </span>
                                <svg class="my-auto ml-auto" width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1 1L6 6L1 11" stroke="black" stroke-width="2"/>
                                </svg>
                            </span>
                        </span>
                    </span>
                    
                </div>
            </div>
        </div>

        <div v-if="previewImage !== null" class="imageBox">
            <div class="imagePreviewWrapper" :style="{ 'background-image': `url(${previewImage})` }" @click="selectImage"></div>
            <i class="far fa-times fa-2x float-right mx-5 my-4 font-weight-light" style="cursor: pointer" title="Close" @click="previewImage = null"></i>
            <button class="send__button btn btn-success position-absolute px-4"><i class="far fa-paper-plane"></i></button>
        </div>
        <input ref="fileInput" id="file" type="file" @input="pickFile" hidden>
        {{showChatById}}
    </div>
</template>

<script>
    import { Picker } from 'emoji-mart-vue'

    export default {
        name: "allChats",

        components: { Picker },

        computed: {
            /* P R O P E R T Y   F O R   R E N D E R I N G
               A N D   A U T O   R E L O A D I N G   C H A N N E L S   G R O U P */
            getChannels(){
                return {
                    channels:[{
                    chan: {
                        idChannel : 'all',
                        iconSVG: `<svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M25.6024 4.39699C22.7695 1.56407 19.0069 0 14.9994 0C10.9918 0 7.22928 1.56407 4.39636 4.39699C-1.06846 9.86181 -1.46419 18.593 3.4039 24.5101C2.73179 25.8857 1.94033 26.8028 1.04209 27.2425C0.49561 27.5126 0.187821 28.103 0.275761 28.706C0.369982 29.3153 0.834806 29.7864 1.4441 29.8807C1.77702 29.9309 2.13506 29.9623 2.50566 29.9623C4.34611 29.9623 6.28079 29.3279 7.89511 28.2161C10.0685 29.3844 12.5119 30 14.9994 30C19.0069 30 22.7695 28.4422 25.6024 25.6093C28.4353 22.7764 29.9931 19.0075 29.9931 15.0063C29.9931 11.005 28.4353 7.2299 25.6024 4.39699ZM24.4026 24.4033C21.8901 26.9158 18.5484 28.2977 14.9994 28.2977C12.625 28.2977 10.2946 27.6633 8.26571 26.4698C8.1338 26.3945 7.98305 26.3505 7.83857 26.3505C7.65641 26.3505 7.46797 26.4133 7.31722 26.5264C5.39511 28.0151 3.46043 28.2349 2.61244 28.2538C3.62375 27.5 4.47174 26.3317 5.18154 24.7048C5.31345 24.4033 5.25692 24.0515 5.03707 23.8003C0.388826 18.549 0.633801 10.5465 5.59611 5.58417C8.10867 3.07161 11.4504 1.6897 14.9994 1.6897C18.5484 1.6897 21.8901 3.07161 24.4026 5.58417C29.5911 10.7789 29.5911 19.2211 24.4026 24.4033Z" fill="#395BB6"/>
                                    <path d="M9 10H11.8947V12.8947H9V10Z" fill="#395BB6"/>
                                    <path d="M13.6318 10H16.5266V12.8947H13.6318V10Z" fill="#395BB6"/>
                                    <path d="M18.2627 10H21.1574V12.8947H18.2627V10Z" fill="#395BB6"/>
                                    <path d="M9 14.0526H11.8947V16.9474H9V14.0526Z" fill="#395BB6"/>
                                    <path d="M13.6318 14.0526H16.5266V16.9474H13.6318V14.0526Z" fill="#395BB6"/>
                                    <path d="M18.2627 14.0526H21.1574V16.9474H18.2627V14.0526Z" fill="#395BB6"/>
                                    <path d="M9 18.1053H11.8947V21H9V18.1053Z" fill="#395BB6"/>
                                    <path d="M13.6318 18.1053H16.5266V21H13.6318V18.1053Z" fill="#395BB6"/>
                                    <path d="M18.2627 18.1053H21.1574V21H18.2627V18.1053Z" fill="#395BB6"/>
                                </svg>
                                `,
                        popoverText: 'Toutes les discussions',
                        count: 10
                    }
                },
                {
                    chan: {
                        idChannel : 'messenger',
                        iconSVG: `<svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M17.3668 13.3832L13.401 9.14383L4.51855 18.7946L12.634 16.043L16.5999 20.2824L25.4823 10.6316L17.3668 13.3832ZM16.5893 17.6983L13.1433 14.0144L10.4745 14.9192L13.4115 11.7281L16.8578 15.412L19.5263 14.5072L16.5893 17.6983Z" fill="#43425D"/>
                                    <path d="M25.589 4.15169C22.7579 1.47446 18.9974 0 15 0C11.0026 0 7.24205 1.47446 4.41101 4.15169C1.56647 6.84174 0 10.4221 0 14.2332C0 18.352 1.85738 22.2288 5.11162 24.9362V30L9.75128 27.5697C11.429 28.1651 13.1925 28.4665 15 28.4665C18.9974 28.4665 22.7579 26.992 25.589 24.3148C28.4335 21.6248 30 18.0444 30 14.2332C30 10.4221 28.4335 6.84174 25.589 4.15169ZM15 26.7087C13.2731 26.7087 11.5924 26.3995 10.0044 25.7895L9.63364 25.6471L6.86943 27.0948V24.0889L6.53297 23.825C3.49823 21.4444 1.75781 17.9482 1.75781 14.2332C1.75781 7.3542 7.69821 1.75781 15 1.75781C22.3018 1.75781 28.2422 7.3542 28.2422 14.2332C28.2422 21.1123 22.3018 26.7087 15 26.7087Z" fill="#43425D"/>
                                </svg>`,
                        popoverText: 'Messenger',
                        count: 2
                    }
                },
                {
                    chan: {
                        idChannel : 'twitter',
                        iconSVG: `<svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M21.4326 12.0177C21.4326 11.8664 21.4299 11.7164 21.4231 11.5677C22.0708 11.085 22.6326 10.4809 23.0772 9.78956C22.4826 10.0569 21.8445 10.2355 21.1735 10.3104C21.8581 9.88907 22.3831 9.21544 22.6313 8.40681C21.9903 8.79544 21.2813 9.07363 20.5272 9.21819C19.9231 8.53088 19.0613 8.09319 18.108 8.07681C16.278 8.04681 14.7944 9.59319 14.7944 11.5309C14.7944 11.8063 14.823 12.0736 14.8803 12.3313C12.1244 12.1541 9.68216 10.7195 8.04848 8.55682C7.76348 9.075 7.59985 9.68044 7.59985 10.3296C7.59985 11.5569 8.18485 12.6477 9.07392 13.2914C8.52985 13.2669 8.01985 13.1019 7.5726 12.8318C7.5726 12.8468 7.5726 12.8618 7.5726 12.8768C7.5726 14.5923 8.71534 16.0296 10.2317 16.365C9.95348 16.4441 9.66029 16.485 9.35892 16.4837C9.14485 16.4823 8.93755 16.4591 8.73574 16.4154C9.15711 17.8214 10.3817 18.8482 11.8312 18.8823C10.6966 19.8231 9.26755 20.385 7.71574 20.3809C7.44843 20.3809 7.18392 20.3632 6.9248 20.3304C8.39211 21.3368 10.1334 21.9231 12.0057 21.9231C18.0999 21.9246 21.4326 16.62 21.4326 12.0177Z" fill="#43425D"/>
                                    <path d="M30 15C30 6.71588 23.2841 0 15 0C6.71588 0 0 6.71588 0 15C0 23.2841 6.71588 30 15 30C23.2841 30 30 23.2841 30 15ZM1.36363 15C1.36363 7.46863 7.46863 1.36363 15 1.36363C22.5314 1.36363 28.6364 7.46863 28.6364 15C28.6364 22.5314 22.5314 28.6364 15 28.6364C7.46863 28.6364 1.36363 22.5314 1.36363 15Z" fill="#43425D"/>
                                </svg>
                                `,
                        popoverText: 'Twitter',
                        count: 1
                    }
                },
                {
                    chan: {
                        idChannel : 'whatsapp',
                        iconSVG: `<svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M30 14.6137C30 22.6847 23.407 29.2273 15.2727 29.2273C12.6903 29.2273 10.2643 28.5673 8.15367 27.409L0 30L2.65833 22.1593C1.31733 19.9573 0.545 17.3747 0.545 14.6137C0.545 6.54267 7.13867 0 15.2727 0C23.4077 0 30 6.54267 30 14.6137ZM15.2727 2.32733C8.44467 2.32733 2.89067 7.839 2.89067 14.6137C2.89067 17.302 3.767 19.7917 5.24933 21.817L3.70233 26.38L8.46067 24.8677C10.4157 26.1513 12.7577 26.9 15.273 26.9C22.1 26.9 27.655 21.389 27.655 14.6143C27.655 7.83967 22.1003 2.32733 15.2727 2.32733ZM22.7097 17.9793C22.6187 17.8303 22.3783 17.7403 22.0177 17.5613C21.6563 17.3823 19.881 16.5153 19.551 16.3963C19.22 16.277 18.9787 16.217 18.7383 16.5753C18.498 16.934 17.806 17.7403 17.595 17.9793C17.3843 18.219 17.174 18.249 16.8127 18.0697C16.452 17.8907 15.289 17.512 13.91 16.292C12.837 15.3427 12.1123 14.1707 11.9017 13.8117C11.6913 13.4533 11.8797 13.2597 12.06 13.0813C12.2227 12.9207 12.4213 12.663 12.6017 12.454C12.7827 12.2447 12.8427 12.0957 12.9623 11.8563C13.0833 11.6173 13.023 11.4083 12.9323 11.2287C12.8423 11.0497 12.1197 9.287 11.819 8.56967C11.5183 7.853 11.218 7.97233 11.007 7.97233C10.7967 7.97233 10.5557 7.94233 10.315 7.94233C10.0743 7.94233 9.683 8.032 9.352 8.39033C9.02133 8.749 8.089 9.61567 8.089 11.378C8.089 13.1407 9.382 14.8437 9.563 15.0823C9.74333 15.321 12.0597 19.0557 15.7297 20.49C19.4 21.9237 19.4 21.4453 20.062 21.3853C20.7233 21.3257 22.1973 20.519 22.4993 19.683C22.7993 18.8457 22.7993 18.1287 22.7097 17.9793Z" fill="#43425D"/>
                                </svg>`,
                        popoverText: 'WhatsApp',
                        count: 1
                    }
                },
                {
                    chan: {
                        idChannel : 'phoneMsg',
                        iconSVG: `<svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M13.725 24.8538H10.2737C9.78821 24.8538 9.39453 25.2475 9.39453 25.7332C9.39453 26.2186 9.78821 26.6123 10.2737 26.6123H13.725C14.2104 26.6123 14.6041 26.2186 14.6041 25.7332C14.6041 25.2475 14.2104 24.8538 13.725 24.8538Z" fill="#43425D"/>
                                    <path d="M23.3368 7.80785H21.362V3.38196C21.3618 1.51726 19.8447 0 17.9798 0H6.01868C4.15398 0 2.63672 1.51726 2.63672 3.38196V26.618C2.63672 28.4827 4.15398 30 6.01868 30H17.9798C19.8447 30 21.3618 28.4827 21.3618 26.618V19.1073H23.3368C25.548 19.1073 27.347 17.3083 27.347 15.0968V11.8183C27.3473 9.60709 25.548 7.80785 23.3368 7.80785ZM14.6152 1.7585V2.62802H9.38324V1.7585H14.6152ZM19.6033 26.618C19.6033 27.5132 18.875 28.2415 17.9798 28.2415H6.01868C5.12352 28.2415 4.39522 27.5132 4.39522 26.618V3.38196C4.39522 2.4868 5.12352 1.7585 6.01868 1.7585H7.62474V2.69966C7.62474 3.62984 8.38142 4.38652 9.3116 4.38652H14.6871C15.6171 4.38652 16.3737 3.62984 16.3737 2.69966V1.7585H17.9798C18.875 1.7585 19.6033 2.4868 19.6033 3.38196V7.80785H15.1305C12.919 7.80785 11.12 9.60686 11.12 11.8183V19.6056C11.12 20.0091 11.3425 20.3753 11.7004 20.5614C11.8575 20.6431 12.028 20.6834 12.1978 20.6834C12.3866 20.6834 12.5745 20.6335 12.7421 20.535L15.5701 19.1073H19.6033V26.618ZM25.5888 15.0968C25.5888 16.3387 24.5785 17.3488 23.3368 17.3488H15.4035C15.2103 17.3488 15.0238 17.3998 14.8586 17.4966L12.8785 18.4964V11.8183C12.8785 10.5766 13.8888 9.56635 15.1305 9.56635H23.3368C24.5785 9.56635 25.5888 10.5766 25.5888 11.8183V15.0968Z" fill="#43425D"/>
                                    <path d="M23.0806 10.9499H15.3869C14.9015 10.9499 14.5078 11.3436 14.5078 11.8291C14.5078 12.3148 14.9015 12.7084 15.3869 12.7084H23.0806C23.566 12.7084 23.9597 12.3148 23.9597 11.8291C23.9597 11.3436 23.566 10.9499 23.0806 10.9499Z" fill="#43425D"/>
                                    <path d="M23.0804 13.9524H19.2336C18.7479 13.9524 18.3545 14.3461 18.3545 14.8315C18.3545 15.3172 18.7479 15.7109 19.2336 15.7109H23.0804C23.5659 15.7109 23.9596 15.3172 23.9596 14.8315C23.9596 14.3461 23.5659 13.9524 23.0804 13.9524Z" fill="#43425D"/>
                                </svg>
                                `,
                        popoverText: 'Téléphone',
                        count: 2
                    }
                },
                {
                    chan: {
                        idChannel : 'sms',
                        iconSVG: `<svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M30 11.8734C30 9.18007 28.7067 6.65784 26.3585 4.77153C24.0568 2.92272 21.0059 1.90448 17.768 1.90448C14.53 1.90448 11.4791 2.92272 9.17748 4.77153C8.03637 5.68823 7.14522 6.75528 6.52963 7.91889C5.2527 8.32747 4.07859 8.94528 3.07418 9.75212C1.09184 11.3446 0 13.476 0 15.7539C0 17.8309 0.91875 19.8034 2.59541 21.3437L2.43012 27.3474C2.42203 27.6402 2.59037 27.9094 2.85715 28.0306C2.95354 28.0743 3.05602 28.0956 3.15779 28.0956C3.33762 28.0956 3.5151 28.029 3.6525 27.9019L7.92943 23.9442C8.70187 24.0922 9.49582 24.1672 10.295 24.1672C12.967 24.1672 15.4879 23.3407 17.411 21.8381C17.5298 21.8408 17.6487 21.8426 17.768 21.8426C18.9695 21.8426 20.1535 21.7015 21.2934 21.4229L25.0366 24.8866C25.174 25.0137 25.3514 25.0803 25.5313 25.0803C25.633 25.0803 25.7355 25.059 25.8319 25.0153C26.0988 24.8941 26.2671 24.625 26.259 24.3321L26.1168 19.1636C28.59 17.2819 30 14.6448 30 11.8734ZM10.2951 22.7106C9.47197 22.7106 8.656 22.6211 7.87008 22.4442C7.63605 22.3917 7.3916 22.4575 7.21576 22.6202L3.9334 25.6577L4.06037 21.0438C4.06641 20.8236 3.97248 20.6125 3.80479 20.4696C2.29031 19.179 1.45623 17.5042 1.45623 15.7539C1.45623 13.206 3.20584 10.9741 5.80875 9.7622C5.62898 10.4479 5.53594 11.1544 5.53594 11.8734C5.53594 14.5668 6.82922 17.0889 9.17748 18.9753C10.8275 20.3007 12.8625 21.1991 15.0755 21.6016C13.6963 22.3025 12.0554 22.7106 10.2951 22.7106ZM24.9571 18.2085C24.7587 18.3492 24.6438 18.5794 24.6504 18.8225L24.7555 22.6424L21.9902 20.0835C21.8539 19.9574 21.6766 19.8898 21.4956 19.8898C21.4313 19.8898 21.3664 19.8983 21.3027 19.9158C20.1679 20.2279 18.9786 20.3861 17.7679 20.3861C11.8261 20.3861 6.99205 16.5673 6.99205 11.8733C6.99205 7.17938 11.8262 3.36065 17.768 3.36065C23.7098 3.36065 28.5438 7.17944 28.5438 11.8734C28.5438 14.2828 27.2365 16.5919 24.9571 18.2085Z" fill="#43425D"/>
                                    <path d="M17.8694 9.71034C16.5645 9.71034 15.5029 10.7719 15.5029 12.0768C15.5029 13.3816 16.5645 14.4432 17.8694 14.4432C19.1742 14.4432 20.2358 13.3816 20.2358 12.0768C20.2358 10.7719 19.1742 9.71034 17.8694 9.71034ZM17.8694 12.9869C17.3674 12.9869 16.9592 12.5786 16.9592 12.0768C16.9592 11.5749 17.3675 11.1666 17.8694 11.1666C18.3713 11.1666 18.7795 11.5749 18.7795 12.0768C18.7795 12.5786 18.3713 12.9869 17.8694 12.9869Z" fill="#43425D"/>
                                    <path d="M24.0588 9.71034C22.7539 9.71034 21.6924 10.7719 21.6924 12.0768C21.6924 13.3816 22.7539 14.4432 24.0588 14.4432C25.3637 14.4432 26.4252 13.3816 26.4252 12.0768C26.4252 10.7719 25.3637 9.71034 24.0588 9.71034ZM24.0588 12.9869C23.5569 12.9869 23.1487 12.5786 23.1487 12.0768C23.1487 11.5749 23.557 11.1666 24.0588 11.1666C24.5607 11.1666 24.9689 11.5749 24.9689 12.0768C24.9689 12.5786 24.5607 12.9869 24.0588 12.9869Z" fill="#43425D"/>
                                    <path d="M11.6809 9.71034C10.3761 9.71034 9.31445 10.7719 9.31445 12.0768C9.31445 13.3816 10.3761 14.4432 11.6809 14.4432C12.9856 14.4432 14.0473 13.3816 14.0473 12.0768C14.0473 10.7719 12.9858 9.71034 11.6809 9.71034ZM11.6809 12.9869C11.179 12.9869 10.7707 12.5786 10.7707 12.0768C10.7707 11.5749 11.179 11.1666 11.6809 11.1666C12.1828 11.1666 12.591 11.5749 12.591 12.0768C12.591 12.5786 12.1828 12.9869 11.6809 12.9869Z" fill="#43425D"/>
                                </svg>
                                `,
                        popoverText: 'SMS',
                        count: 2
                    }
                },
                {
                    chan: {
                        idChannel : 'email',
                        iconSVG: `<svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M27.3633 3.57422H2.63672C1.18465 3.57422 0 4.75758 0 6.21094V23.7891C0 25.2375 1.17938 26.4258 2.63672 26.4258H27.3633C28.8117 26.4258 30 25.2464 30 23.7891V6.21094C30 4.7625 28.8206 3.57422 27.3633 3.57422ZM26.9992 5.33203L15.0559 17.2754L3.00932 5.33203H26.9992ZM1.75781 23.4251V6.56654L10.2234 14.9595L1.75781 23.4251ZM3.00076 24.668L11.4717 16.1971L14.4398 19.1398C14.7834 19.4804 15.3379 19.4793 15.6801 19.1371L18.5742 16.243L26.9992 24.668H3.00076ZM28.2422 23.425L19.8172 15L28.2422 6.57492V23.425Z" fill="#43425D"/>
                                </svg>
                                `,
                        popoverText: 'Email',
                        count: 2
                    }
                }]
                }
            },

            /* P R O P E R T Y   F O R   R E N D E R I N G   A N D
               A U T O   R E L O A D I N G   C H A T S   S T A T U S */
            getStatus(){
                //let self = this;
                return {
                    status: [{
                        stat: {
                            id: 'all',
                            title: 'Tous',
                            badgeColor: '',
                            badgeCount: null
                        }
                    },
                    {
                        stat: {
                            id: 'new',
                            title: 'Nouveaux',
                            badgeColor: '#ED1818',
                            badgeCount: 3
                        }
                    },
                    {
                        stat: {
                            id: 'progress',
                            title: 'En cours',
                            badgeColor: '#395BB6',
                            badgeCount: 2
                        }
                    },
                    {
                        stat: {
                            id: 'processing',
                            title: 'En traitement',
                            badgeColor: '#FFA53B',
                            badgeCount: 1
                        }
                    }]
                }
            },

            /* P R O P E R T Y   F O R   R E N D E R I N G   A N D
               A U T O   R E L O A D I N G   A L L   C H A T S */
            allChats(){
                return {
                    Chats: [
                        {
                            chat: {
                                "name": {
                                    "firstname": "Patrice",
                                    "lastname": "Simpson"
                                },
                                "fullname": "Patrice Simpson",
                                "profileImage": "https://media.gettyimages.com/vectors/profile-icon-male-avatar-portrait-casual-person-vector-id530827853",
                                "idChannel": "email",
                                "channelBadge": `<svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <circle cx="12.5" cy="12.5" r="11.5" fill="#395BB6" stroke="white" stroke-width="2"/>
                                                    <path d="M18.6816 6.78711H6.31836C5.59232 6.78711 5 7.37879 5 8.10547V16.8945C5 17.6187 5.58969 18.2129 6.31836 18.2129H18.6816C19.4059 18.2129 20 17.6232 20 16.8945V8.10547C20 7.38125 19.4103 6.78711 18.6816 6.78711ZM18.4996 7.66602L12.5279 13.6377L6.50466 7.66602H18.4996ZM5.87891 16.7125V8.28327L10.1117 12.4798L5.87891 16.7125ZM6.50038 17.334L10.7358 13.0985L12.2199 14.5699C12.3917 14.7402 12.669 14.7397 12.84 14.5685L14.2871 13.1215L18.4996 17.334H6.50038ZM19.1211 16.7125L14.9086 12.5L19.1211 8.28746V16.7125Z" fill="white"/>
                                                    </svg>
                                                    `,
                                "badgeColor": "#ED1818",
                                "statusId": "new",
                                "messages": [
                                    {
                                        "text": "Consequat eiusmod ipsum officia sit do aute.",
                                        "author": "Me",
                                        "date": "Friday, September 18, 2015 11:35 AM",
                                        "status": false
                                    },
                                    {
                                        "text": "Dolore veniam aliqua veniam laborum velit ipsum.",
                                        "author": "You",
                                        "date": "Friday, September 18, 2015 12:35 PM",
                                        "status": false
                                    }
                                ],
                                "tel": "+229 (820) 538-2796",
                                "mail": "patrice.simpson@gmail.com",
                                "history":false,
                                "friend": false,
                                "opened": false
                            }
                        },
                        {
                            chat: {
                                "name": {
                                    "firstname": "Rosario",
                                    "lastname": "Love"
                                },
                                "fullname": "Rosario Love",
                                "profileImage": "https://image.freepik.com/vecteurs-libre/portrait-femme-afro-americaine-profil-avatar-jeune-fille-noire_102172-418.jpg",
                                "idChannel": "sms",
                                "channelBadge": `<svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <circle cx="12.5" cy="12.5" r="11.5" fill="#395BB6" stroke="white" stroke-width="2"/>
                                                    <path d="M20 10.9367C20 9.59003 19.3534 8.32892 18.1792 7.38577C17.0284 6.46136 15.503 5.95224 13.884 5.95224C12.265 5.95224 10.7396 6.46136 9.58874 7.38577C9.01818 7.84412 8.57261 8.37764 8.26481 8.95945C7.62635 9.16373 7.0393 9.47264 6.53709 9.87606C5.54592 10.6723 5 11.738 5 12.877C5 13.9155 5.45937 14.9017 6.29771 15.6718L6.21506 18.6737C6.21102 18.8201 6.29519 18.9547 6.42857 19.0153C6.47677 19.0372 6.52801 19.0478 6.5789 19.0478C6.66881 19.0478 6.75755 19.0145 6.82625 18.951L8.96472 16.9721C9.35094 17.0461 9.74791 17.0836 10.1475 17.0836C11.4835 17.0836 12.7439 16.6704 13.7055 15.919C13.7649 15.9204 13.8243 15.9213 13.884 15.9213C14.4848 15.9213 15.0767 15.8508 15.6467 15.7114L17.5183 17.4433C17.587 17.5068 17.6757 17.5401 17.7656 17.5401C17.8165 17.5401 17.8678 17.5295 17.916 17.5076C18.0494 17.4471 18.1335 17.3125 18.1295 17.166L18.0584 14.5818C19.295 13.6409 20 12.3224 20 10.9367ZM10.1475 16.3553C9.73599 16.3553 9.328 16.3105 8.93504 16.2221C8.81803 16.1959 8.6958 16.2287 8.60788 16.3101L6.9667 17.8288L7.03019 15.5219C7.0332 15.4118 6.98624 15.3062 6.90239 15.2348C6.14516 14.5895 5.72812 13.7521 5.72812 12.8769C5.72812 11.603 6.60292 10.487 7.90438 9.8811C7.81449 10.2239 7.76797 10.5772 7.76797 10.9367C7.76797 12.2834 8.41461 13.5445 9.58874 14.4877C10.4137 15.1503 11.4313 15.5995 12.5378 15.8008C11.8481 16.1512 11.0277 16.3553 10.1475 16.3553ZM17.4785 14.1042C17.3794 14.1746 17.3219 14.2897 17.3252 14.4112L17.3778 16.3212L15.9951 15.0417C15.927 14.9787 15.8383 14.9449 15.7478 14.9449C15.7156 14.9449 15.6832 14.9491 15.6513 14.9579C15.0839 15.1139 14.4893 15.193 13.8839 15.193C10.913 15.193 8.49603 13.2836 8.49603 10.9367C8.49603 8.58969 10.9131 6.68033 13.884 6.68033C16.8549 6.68033 19.2719 8.58972 19.2719 10.9367C19.2719 12.1414 18.6182 13.2959 17.4785 14.1042Z" fill="white"/>
                                                    <path d="M13.9352 9.85516C13.2827 9.85516 12.752 10.3859 12.752 11.0384C12.752 11.6908 13.2827 12.2216 13.9352 12.2216C14.5876 12.2216 15.1184 11.6908 15.1184 11.0384C15.1184 10.3859 14.5876 9.85516 13.9352 9.85516ZM13.9352 11.4934C13.6842 11.4934 13.4801 11.2893 13.4801 11.0384C13.4801 10.7874 13.6842 10.5833 13.9352 10.5833C14.1861 10.5833 14.3902 10.7874 14.3902 11.0384C14.3902 11.2893 14.1861 11.4934 13.9352 11.4934Z" fill="white"/>
                                                    <path d="M17.0289 9.85516C16.3765 9.85516 15.8457 10.3859 15.8457 11.0384C15.8457 11.6908 16.3765 12.2216 17.0289 12.2216C17.6814 12.2216 18.2121 11.6908 18.2121 11.0384C18.2121 10.3859 17.6814 9.85516 17.0289 9.85516ZM17.0289 11.4934C16.778 11.4934 16.5738 11.2893 16.5738 11.0384C16.5738 10.7874 16.778 10.5833 17.0289 10.5833C17.2798 10.5833 17.484 10.7874 17.484 11.0384C17.484 11.2893 17.2799 11.4934 17.0289 11.4934Z" fill="white"/>
                                                    <path d="M10.8404 9.85516C10.188 9.85516 9.65723 10.3859 9.65723 11.0384C9.65723 11.6908 10.188 12.2216 10.8404 12.2216C11.4928 12.2216 12.0237 11.6908 12.0237 11.0384C12.0237 10.3859 11.4929 9.85516 10.8404 9.85516ZM10.8404 11.4934C10.5895 11.4934 10.3854 11.2893 10.3854 11.0384C10.3854 10.7874 10.5895 10.5833 10.8404 10.5833C11.0914 10.5833 11.2955 10.7874 11.2955 11.0384C11.2955 11.2893 11.0914 11.4934 10.8404 11.4934Z" fill="white"/>
                                                    </svg>
                                                    `,
                                "badgeColor": "#395BB6",
                                "statusId": "progress",
                                "messages": [
                                    {
                                        "text": "Excepteur ea minim amet veniam nulla proident.",
                                        "author": "You",
                                        "date": "Friday, July 12, 2019 3:27 PM",
                                        "status": false
                                    },
                                    {
                                        "text": "Incididunt voluptate minim nisi laboris adipisicing.",
                                        "author": "Me",
                                        "date": "Friday, July 12, 2019 4:27 PM",
                                        "status": false
                                    }
                                ],
                                "tel": "+229 (921) 444-3204",
                                "mail": "rosario.love@gmail.com",
                                "history":false,
                                "friend": false,
                                "opened": false
                            }
                        },
                        {
                            chat: {
                                "name": {
                                    "firstname": "Edna",
                                    "lastname": "Burris"
                                },
                                "fullname": "Edna Burris",
                                "profileImage": "https://image.freepik.com/vecteurs-libre/portrait-femme-afro-americaine-profil-avatar-jeune-fille-noire_102172-418.jpg",
                                "idChannel": "phoneMsg",
                                "channelBadge" :`<svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <circle cx="12.5" cy="12.5" r="11.5" fill="#395BB6" stroke="white" stroke-width="2"/>
                                                    <path d="M11.8625 17.4269H10.1368C9.8941 17.4269 9.69727 17.6237 9.69727 17.8666C9.69727 18.1093 9.8941 18.3062 10.1368 18.3062H11.8625C12.1052 18.3062 12.3021 18.1093 12.3021 17.8666C12.3021 17.6237 12.1052 17.4269 11.8625 17.4269Z" fill="white"/>
                                                    <path d="M16.6684 8.90392H15.681V6.69098C15.6809 5.75863 14.9224 5 13.9899 5H8.00934C7.07699 5 6.31836 5.75863 6.31836 6.69098V18.309C6.31836 19.2414 7.07699 20 8.00934 20H13.9899C14.9224 20 15.6809 19.2414 15.6809 18.309V14.5536H16.6684C17.774 14.5536 18.6735 13.6541 18.6735 12.5484V10.9092C18.6736 9.80354 17.774 8.90392 16.6684 8.90392ZM12.3076 5.87925V6.31401H9.69162V5.87925H12.3076ZM14.8016 18.309C14.8016 18.7566 14.4375 19.1208 13.9899 19.1208H8.00934C7.56176 19.1208 7.19761 18.7566 7.19761 18.309V6.69098C7.19761 6.2434 7.56176 5.87925 8.00934 5.87925H8.81237V6.34983C8.81237 6.81492 9.19071 7.19326 9.6558 7.19326H12.3436C12.8085 7.19326 13.1869 6.81492 13.1869 6.34983V5.87925H13.9899C14.4375 5.87925 14.8016 6.2434 14.8016 6.69098V8.90392H12.5652C11.4595 8.90392 10.56 9.80343 10.56 10.9092V14.8028C10.56 15.0045 10.6712 15.1876 10.8502 15.2807C10.9287 15.3215 11.014 15.3417 11.0989 15.3417C11.1933 15.3417 11.2873 15.3167 11.371 15.2675L12.7851 14.5536H14.8016V18.309ZM17.7944 12.5484C17.7944 13.1694 17.2892 13.6744 16.6684 13.6744H12.7018C12.6052 13.6744 12.5119 13.6999 12.4293 13.7483L11.4392 14.2482V10.9092C11.4392 10.2883 11.9444 9.78317 12.5652 9.78317H16.6684C17.2892 9.78317 17.7944 10.2883 17.7944 10.9092V12.5484Z" fill="white"/>
                                                    <path d="M16.5403 10.475H12.6935C12.4507 10.475 12.2539 10.6718 12.2539 10.9145C12.2539 11.1574 12.4507 11.3542 12.6935 11.3542H16.5403C16.783 11.3542 16.9799 11.1574 16.9799 10.9145C16.9799 10.6718 16.783 10.475 16.5403 10.475Z" fill="white"/>
                                                    <path d="M16.5407 11.9762H14.6173C14.3745 11.9762 14.1777 12.173 14.1777 12.4158C14.1777 12.6586 14.3745 12.8554 14.6173 12.8554H16.5407C16.7834 12.8554 16.9803 12.6586 16.9803 12.4158C16.9803 12.173 16.7834 11.9762 16.5407 11.9762Z" fill="white"/>
                                                    </svg>
                                                    `,
                                "badgeColor": "#ED1818",
                                "statusId": "new",
                                "messages": [
                                    {
                                        "text": "Dolore officia culpa exercitation eu consectetur.",
                                        "author": "You",
                                        "date": "Tuesday, May 31, 2016 4:57 PM",
                                        "status": false
                                    },
                                    {
                                        "text": "Pariatur officia laborum ad cupidatat pariatur.",
                                        "author": "Me",
                                        "date": "Tuesday, May 31, 2016 5:57 PM",
                                        "status": false
                                    }
                                ],
                                "tel": "+229 (961) 508-3881",
                                "mail": "edna.burris@gmail.com",
                                "history":false,
                                "friend": false,
                                "opened": false
                            }
                        },
                        {
                            chat: {
                                "name": {
                                    "firstname": "Harriett",
                                    "lastname": "Graham"
                                },
                                "fullname": "Harriett Graham",
                                "profileImage": "https://image.freepik.com/vecteurs-libre/portrait-femme-afro-americaine-profil-avatar-jeune-fille-noire_102172-418.jpg",
                                "idChannel": "whatsapp",
                                "badgeColor": "#395BB6",
                                "channelBadge": `<svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <circle cx="12.5" cy="12.5" r="11.5" fill="#4AD991" stroke="white" stroke-width="2"/>
                                                <path d="M20 12.3068C20 16.3423 16.7035 19.6137 12.6363 19.6137C11.3452 19.6137 10.1322 19.2837 9.07683 18.7045L5 20L6.32917 16.0797C5.65867 14.9787 5.2725 13.6873 5.2725 12.3068C5.2725 8.27133 8.56933 5 12.6363 5C16.7038 5 20 8.27133 20 12.3068ZM12.6363 6.16367C9.22233 6.16367 6.44533 8.9195 6.44533 12.3068C6.44533 13.651 6.8835 14.8958 7.62467 15.9085L6.85117 18.19L9.23033 17.4338C10.2078 18.0757 11.3788 18.45 12.6365 18.45C16.05 18.45 18.8275 15.6945 18.8275 12.3072C18.8275 8.91983 16.0502 6.16367 12.6363 6.16367ZM16.3548 13.9897C16.3093 13.9152 16.1892 13.8702 16.0088 13.7807C15.8282 13.6912 14.9405 13.2577 14.7755 13.1982C14.61 13.1385 14.4893 13.1085 14.3692 13.2877C14.249 13.467 13.903 13.8702 13.7975 13.9897C13.6922 14.1095 13.587 14.1245 13.4063 14.0348C13.226 13.9453 12.6445 13.756 11.955 13.146C11.4185 12.6713 11.0562 12.0853 10.9508 11.9058C10.8457 11.7267 10.9398 11.6298 11.03 11.5407C11.1113 11.4603 11.2107 11.3315 11.3008 11.227C11.3913 11.1223 11.4213 11.0478 11.4812 10.9282C11.5417 10.8087 11.5115 10.7042 11.4662 10.6143C11.4212 10.5248 11.0598 9.6435 10.9095 9.28483C10.7592 8.9265 10.609 8.98617 10.5035 8.98617C10.3983 8.98617 10.2778 8.97117 10.1575 8.97117C10.0372 8.97117 9.8415 9.016 9.676 9.19517C9.51067 9.3745 9.0445 9.80783 9.0445 10.689C9.0445 11.5703 9.691 12.4218 9.7815 12.5412C9.87167 12.6605 11.0298 14.5278 12.8648 15.245C14.7 15.9618 14.7 15.7227 15.031 15.6927C15.3617 15.6628 16.0987 15.2595 16.2497 14.8415C16.3997 14.4228 16.3997 14.0643 16.3548 13.9897Z" fill="white"/>
                                                </svg>
                                                `,
                                "statusId": "progress",
                                "messages": [
                                    {
                                        "text": "Ex exercitation quis fugiat nulla duis anim.",
                                        "author": "You",
                                        "date": "Sunday, January 21, 2018 5:17 AM",
                                        "status": false
                                    },
                                    {
                                        "text": "Eiusmod laboris consequat cupidatat ullamco esse.",
                                        "author": "Me",
                                        "date": "Sunday, January 21, 2018 6:17 AM",
                                        "status": false
                                    }
                                ],
                                "tel": "+229 (845) 546-3301",
                                "mail": "harriett.graham@gmail.com",
                                "history":false,
                                "friend": false,
                                "opened": false
                            }
                        },
                        {
                            chat: {
                                "name": {
                                    "firstname": "Rios",
                                    "lastname": "Blackwell"
                                },
                                "fullname": "Rios Blackwell",
                                "profileImage": "https://media.gettyimages.com/vectors/profile-icon-male-avatar-portrait-casual-person-vector-id530827853",
                                "idChannel": "email",
                                "channelBadge": `<svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <circle cx="12.5" cy="12.5" r="11.5" fill="#395BB6" stroke="white" stroke-width="2"/>
                                                    <path d="M18.6816 6.78711H6.31836C5.59232 6.78711 5 7.37879 5 8.10547V16.8945C5 17.6187 5.58969 18.2129 6.31836 18.2129H18.6816C19.4059 18.2129 20 17.6232 20 16.8945V8.10547C20 7.38125 19.4103 6.78711 18.6816 6.78711ZM18.4996 7.66602L12.5279 13.6377L6.50466 7.66602H18.4996ZM5.87891 16.7125V8.28327L10.1117 12.4798L5.87891 16.7125ZM6.50038 17.334L10.7358 13.0985L12.2199 14.5699C12.3917 14.7402 12.669 14.7397 12.84 14.5685L14.2871 13.1215L18.4996 17.334H6.50038ZM19.1211 16.7125L14.9086 12.5L19.1211 8.28746V16.7125Z" fill="white"/>
                                                    </svg>
                                                    `,
                                "badgeColor": "#FFA53B",
                                "statusId": "processing",
                                "messages": [
                                    {
                                        "text": "Incididunt eu veniam dolor et pariatur.",
                                        "author": "You",
                                        "date": "Tuesday, May 6, 2014 8:19 AM",
                                        "status": false
                                    },
                                    {
                                        "text": "Eiusmod duis ullamco eiusmod adipisicing.",
                                        "author": "Me",
                                        "date": "Tuesday, May 6, 2014 10:19 AM",
                                        "status": false
                                    }
                                ],
                                "tel": "+229 (878) 462-2333",
                                "mail": "rios.blackwell@gmail.com",
                                "history":false,
                                "friend": false,
                                "opened": false
                            }
                        },
                        {
                            chat: {
                                "name": {
                                    "firstname": "Preston",
                                    "lastname": "Horton"
                                },
                                "fullname": "Preston Horton",
                                "profileImage": "https://media.istockphoto.com/vectors/business-man-profile-icon-african-american-ethnic-male-avatar-vector-id518057046",
                                "idChannel": "sms",
                                "channelBadge": `<svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <circle cx="12.5" cy="12.5" r="11.5" fill="#395BB6" stroke="white" stroke-width="2"/>
                                                    <path d="M20 10.9367C20 9.59003 19.3534 8.32892 18.1792 7.38577C17.0284 6.46136 15.503 5.95224 13.884 5.95224C12.265 5.95224 10.7396 6.46136 9.58874 7.38577C9.01818 7.84412 8.57261 8.37764 8.26481 8.95945C7.62635 9.16373 7.0393 9.47264 6.53709 9.87606C5.54592 10.6723 5 11.738 5 12.877C5 13.9155 5.45937 14.9017 6.29771 15.6718L6.21506 18.6737C6.21102 18.8201 6.29519 18.9547 6.42857 19.0153C6.47677 19.0372 6.52801 19.0478 6.5789 19.0478C6.66881 19.0478 6.75755 19.0145 6.82625 18.951L8.96472 16.9721C9.35094 17.0461 9.74791 17.0836 10.1475 17.0836C11.4835 17.0836 12.7439 16.6704 13.7055 15.919C13.7649 15.9204 13.8243 15.9213 13.884 15.9213C14.4848 15.9213 15.0767 15.8508 15.6467 15.7114L17.5183 17.4433C17.587 17.5068 17.6757 17.5401 17.7656 17.5401C17.8165 17.5401 17.8678 17.5295 17.916 17.5076C18.0494 17.4471 18.1335 17.3125 18.1295 17.166L18.0584 14.5818C19.295 13.6409 20 12.3224 20 10.9367ZM10.1475 16.3553C9.73599 16.3553 9.328 16.3105 8.93504 16.2221C8.81803 16.1959 8.6958 16.2287 8.60788 16.3101L6.9667 17.8288L7.03019 15.5219C7.0332 15.4118 6.98624 15.3062 6.90239 15.2348C6.14516 14.5895 5.72812 13.7521 5.72812 12.8769C5.72812 11.603 6.60292 10.487 7.90438 9.8811C7.81449 10.2239 7.76797 10.5772 7.76797 10.9367C7.76797 12.2834 8.41461 13.5445 9.58874 14.4877C10.4137 15.1503 11.4313 15.5995 12.5378 15.8008C11.8481 16.1512 11.0277 16.3553 10.1475 16.3553ZM17.4785 14.1042C17.3794 14.1746 17.3219 14.2897 17.3252 14.4112L17.3778 16.3212L15.9951 15.0417C15.927 14.9787 15.8383 14.9449 15.7478 14.9449C15.7156 14.9449 15.6832 14.9491 15.6513 14.9579C15.0839 15.1139 14.4893 15.193 13.8839 15.193C10.913 15.193 8.49603 13.2836 8.49603 10.9367C8.49603 8.58969 10.9131 6.68033 13.884 6.68033C16.8549 6.68033 19.2719 8.58972 19.2719 10.9367C19.2719 12.1414 18.6182 13.2959 17.4785 14.1042Z" fill="white"/>
                                                    <path d="M13.9352 9.85516C13.2827 9.85516 12.752 10.3859 12.752 11.0384C12.752 11.6908 13.2827 12.2216 13.9352 12.2216C14.5876 12.2216 15.1184 11.6908 15.1184 11.0384C15.1184 10.3859 14.5876 9.85516 13.9352 9.85516ZM13.9352 11.4934C13.6842 11.4934 13.4801 11.2893 13.4801 11.0384C13.4801 10.7874 13.6842 10.5833 13.9352 10.5833C14.1861 10.5833 14.3902 10.7874 14.3902 11.0384C14.3902 11.2893 14.1861 11.4934 13.9352 11.4934Z" fill="white"/>
                                                    <path d="M17.0289 9.85516C16.3765 9.85516 15.8457 10.3859 15.8457 11.0384C15.8457 11.6908 16.3765 12.2216 17.0289 12.2216C17.6814 12.2216 18.2121 11.6908 18.2121 11.0384C18.2121 10.3859 17.6814 9.85516 17.0289 9.85516ZM17.0289 11.4934C16.778 11.4934 16.5738 11.2893 16.5738 11.0384C16.5738 10.7874 16.778 10.5833 17.0289 10.5833C17.2798 10.5833 17.484 10.7874 17.484 11.0384C17.484 11.2893 17.2799 11.4934 17.0289 11.4934Z" fill="white"/>
                                                    <path d="M10.8404 9.85516C10.188 9.85516 9.65723 10.3859 9.65723 11.0384C9.65723 11.6908 10.188 12.2216 10.8404 12.2216C11.4928 12.2216 12.0237 11.6908 12.0237 11.0384C12.0237 10.3859 11.4929 9.85516 10.8404 9.85516ZM10.8404 11.4934C10.5895 11.4934 10.3854 11.2893 10.3854 11.0384C10.3854 10.7874 10.5895 10.5833 10.8404 10.5833C11.0914 10.5833 11.2955 10.7874 11.2955 11.0384C11.2955 11.2893 11.0914 11.4934 10.8404 11.4934Z" fill="white"/>
                                                    </svg>
                                                    `,
                                "badgeColor": "#FFA53B",
                                "statusId": "processing",
                                "messages": [
                                    {
                                        "text": "Deserunt do duis dolor officia.",
                                        "author": "You",
                                        "date": "Wednesday, April 23, 2014 5:15 PM",
                                        "status": false
                                    },
                                    {
                                        "text": "Irure ipsum enim veniam consequat ut.",
                                        "author": "Me",
                                        "date": "Wednesday, April 23, 2014 6:15 PM",
                                        "status": false
                                    }
                                ],
                                "tel": "+229 (803) 548-3956",
                                "mail": "preston.horton@gmail.com",
                                "history":false,
                                "friend": false,
                                "opened": false
                            }
                        },
                        {
                            chat: {
                                "name": {
                                    "firstname": "Brooks",
                                    "lastname": "Murray"
                                },
                                "fullname": "Brooks Murray",
                                "profileImage": "https://media.gettyimages.com/vectors/profile-icon-male-avatar-portrait-casual-person-vector-id530827853",
                                "idChannel": "phoneMsg",
                                "channelBadge" :`<svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <circle cx="12.5" cy="12.5" r="11.5" fill="#395BB6" stroke="white" stroke-width="2"/>
                                                    <path d="M11.8625 17.4269H10.1368C9.8941 17.4269 9.69727 17.6237 9.69727 17.8666C9.69727 18.1093 9.8941 18.3062 10.1368 18.3062H11.8625C12.1052 18.3062 12.3021 18.1093 12.3021 17.8666C12.3021 17.6237 12.1052 17.4269 11.8625 17.4269Z" fill="white"/>
                                                    <path d="M16.6684 8.90392H15.681V6.69098C15.6809 5.75863 14.9224 5 13.9899 5H8.00934C7.07699 5 6.31836 5.75863 6.31836 6.69098V18.309C6.31836 19.2414 7.07699 20 8.00934 20H13.9899C14.9224 20 15.6809 19.2414 15.6809 18.309V14.5536H16.6684C17.774 14.5536 18.6735 13.6541 18.6735 12.5484V10.9092C18.6736 9.80354 17.774 8.90392 16.6684 8.90392ZM12.3076 5.87925V6.31401H9.69162V5.87925H12.3076ZM14.8016 18.309C14.8016 18.7566 14.4375 19.1208 13.9899 19.1208H8.00934C7.56176 19.1208 7.19761 18.7566 7.19761 18.309V6.69098C7.19761 6.2434 7.56176 5.87925 8.00934 5.87925H8.81237V6.34983C8.81237 6.81492 9.19071 7.19326 9.6558 7.19326H12.3436C12.8085 7.19326 13.1869 6.81492 13.1869 6.34983V5.87925H13.9899C14.4375 5.87925 14.8016 6.2434 14.8016 6.69098V8.90392H12.5652C11.4595 8.90392 10.56 9.80343 10.56 10.9092V14.8028C10.56 15.0045 10.6712 15.1876 10.8502 15.2807C10.9287 15.3215 11.014 15.3417 11.0989 15.3417C11.1933 15.3417 11.2873 15.3167 11.371 15.2675L12.7851 14.5536H14.8016V18.309ZM17.7944 12.5484C17.7944 13.1694 17.2892 13.6744 16.6684 13.6744H12.7018C12.6052 13.6744 12.5119 13.6999 12.4293 13.7483L11.4392 14.2482V10.9092C11.4392 10.2883 11.9444 9.78317 12.5652 9.78317H16.6684C17.2892 9.78317 17.7944 10.2883 17.7944 10.9092V12.5484Z" fill="white"/>
                                                    <path d="M16.5403 10.475H12.6935C12.4507 10.475 12.2539 10.6718 12.2539 10.9145C12.2539 11.1574 12.4507 11.3542 12.6935 11.3542H16.5403C16.783 11.3542 16.9799 11.1574 16.9799 10.9145C16.9799 10.6718 16.783 10.475 16.5403 10.475Z" fill="white"/>
                                                    <path d="M16.5407 11.9762H14.6173C14.3745 11.9762 14.1777 12.173 14.1777 12.4158C14.1777 12.6586 14.3745 12.8554 14.6173 12.8554H16.5407C16.7834 12.8554 16.9803 12.6586 16.9803 12.4158C16.9803 12.173 16.7834 11.9762 16.5407 11.9762Z" fill="white"/>
                                                    </svg>
                                                    `,
                                "badgeColor": "#FFA53B",
                                "statusId": "processing",
                                "messages": [
                                    {
                                        "text": "Sint qui consectetur esse occaecat.",
                                        "author": "Me",
                                        "date": "Wednesday, January 21, 2015 11:58 PM",
                                        "status": false
                                    },
                                    {
                                        "text": "Magna anim sunt sint sint.",
                                        "author": "You",
                                        "date": "Wednesday, January 22, 2015 0:58 AM",
                                        "status": false
                                    }
                                ],
                                "tel": "+229 (945) 581-3386",
                                "mail": "brooks.murray@gmail.com",
                                "history":false,
                                "friend": false,
                                "opened": false
                            }
                        },
                        {
                            chat: {
                                "name": {
                                    "firstname": "Tammy",
                                    "lastname": "Britt"
                                },
                                "fullname": "Tammy Britt",
                                "profileImage": "https://image.freepik.com/vecteurs-libre/portrait-femme-afro-americaine-profil-avatar-jeune-fille-noire_102172-418.jpg",
                                "idChannel": "twitter",
                                "channelBadge" :`<svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <circle cx="12.5" cy="12.5" r="11.5" fill="#395BB6" stroke="white" stroke-width="2"/>
                                                    <path d="M15.7158 11.0089C15.7158 10.9332 15.7145 10.8582 15.7111 10.7839C16.0349 10.5425 16.3158 10.2405 16.5381 9.89478C16.2408 10.0284 15.9217 10.1177 15.5863 10.1552C15.9286 9.94453 16.1911 9.60772 16.3151 9.20341C15.9947 9.39772 15.6401 9.53681 15.2631 9.60909C14.9611 9.26544 14.5301 9.04659 14.0535 9.03841C13.1385 9.02341 12.3967 9.79659 12.3967 10.7654C12.3967 10.9032 12.411 11.0368 12.4397 11.1657C11.0617 11.077 9.84059 10.3598 9.02375 9.27841C8.88125 9.5375 8.79944 9.84022 8.79944 10.1648C8.79944 10.7784 9.09194 11.3239 9.53647 11.6457C9.26444 11.6334 9.00944 11.5509 8.78581 11.4159C8.78581 11.4234 8.78581 11.4309 8.78581 11.4384C8.78581 12.2962 9.35718 13.0148 10.1153 13.1825C9.97625 13.222 9.82966 13.2425 9.67897 13.2418C9.57194 13.2412 9.46829 13.2296 9.36738 13.2077C9.57807 13.9107 10.1903 14.4241 10.9151 14.4411C10.3478 14.9116 9.63329 15.1925 8.85738 15.1904C8.72373 15.1904 8.59147 15.1816 8.46191 15.1652C9.19557 15.6684 10.0662 15.9616 11.0024 15.9616C14.0494 15.9623 15.7158 13.31 15.7158 11.0089Z" fill="white"/>
                                                    <path d="M20 12.5C20 8.35794 16.642 5 12.5 5C8.35794 5 5 8.35794 5 12.5C5 16.642 8.35794 20 12.5 20C16.642 20 20 16.642 20 12.5ZM5.68181 12.5C5.68181 8.73431 8.73431 5.68181 12.5 5.68181C16.2657 5.68181 19.3182 8.73431 19.3182 12.5C19.3182 16.2657 16.2657 19.3182 12.5 19.3182C8.73431 19.3182 5.68181 16.2657 5.68181 12.5Z" fill="white"/>
                                                    </svg>
                                                    `,
                                "badgeColor": "#FFA53B",
                                "statusId": "processing",
                                "messages": [
                                    {
                                        "text": "Consectetur sint reprehenderit labore.",
                                        "author": "Me",
                                        "date": "Friday, May 2, 2014 10:21 PM",
                                        "status": false
                                    },
                                    {
                                        "text": "Non magna aute mollit laborum proident.",
                                        "author": "You",
                                        "date": "Friday, May 3, 2014 0:21 AM",
                                        "status": false
                                    }
                                ],
                                "tel": "+229 (872) 569-3421",
                                "mail": "tammy.britt@gmail.com",
                                "history":false,
                                "friend": false,
                                "opened": false
                            }
                        }
                    ]
                }
            },

            /* P R O P E R T Y   F O R   D I S P L A Y I N G 
               C H A T   W I T H   T H E   I D   O F   C H A T */
            showChatById(){
                let self = this;
                if(self.chatId !== null){
                    self.allChats.Chats.forEach(element => {
                        if(element.chat.fullname === self.chatId){
                            self.chatData = element
                        }
                    })
                }
                return ''
            }
        },

        props: {
            value: {
                type: String,
                default: ''
            }
        },

        data() {
            return {
                previewImage: null,
                showEmojiPicker: false,
                currentGroup: '',
                selected: false,
                discussionName: '',
                sortArg: 'all',
                chatId: null,
                chatData: null,
                openedId: null,
                active: null,
                currentStatus: null,
                message: '',
                msgMode: [{id: 'txt', mode:'Texte'},{id: 'rep', mode:'Réponses'},{id: 'emo', mode:'Émoticones'}],
                responses: [{rep:'Merci pour la réponse'}, {rep:'Pas possible'}, {rep:'C\'est bien noté!'}, {rep:'Oui! je suis intéressé'}, {rep:'Merci pour l\'info'}, {rep:'En effet non'}],
                modeID: 'txt',
                emoticonId: null
            }
        },

        methods: {
            /* T O G G L E   E M O J I   P I C K E R */
            toggleEmojiPicker () {
                this.showEmojiPicker = !this.showEmojiPicker
            },

            /* A D D   E M O J I */
            addEmoji (emoji) {
                const textarea = this.$refs.textarea
                const cursorPosition = textarea.selectionEnd
                const start = this.value.substring(0, textarea.selectionStart)
                const end = this.value.substring(textarea.selectionStart)
                const text = start + emoji.native + end
                this.message += text
                textarea.focus()
                this.$nextTick(() => {
                    textarea.selectionEnd = cursorPosition + emoji.native.length
                })
            },

            /* A C T I V A T E   T Y P I N G   M O D E */
            activeMode(id){
                return this.modeID === id
            },

            /* A C T I V A T E   C U R R E N T   G R O U P */
            activateCurrent(groupId){
                this.currentGroup = groupId
            },

            /* F U N C T I O N   F O R   A P P L Y I N G   A C T I V E
               C L A S S   E F F E C T   T O   E A C H   C H A N N E L */
            toggleGroup(idGroup){
                if (this.currentGroup !== ''){
                    let group = document.getElementsByClassName('toggleActive')
                    group.forEach(element =>{
                        if (element.getAttribute('id') === idGroup){
                            let paths = element.firstElementChild.children;
                            paths.forEach(path => {
                                path.style.fill = '#395BB6'
                            })
                        }else {
                            let paths = element.firstElementChild.children;
                            paths.forEach(path => {
                                path.style.fill = '#43425D'
                            })
                        }
                    })
                }
            },

            /* S O R T   A L L   D I S C U S S I O N S   B Y   C H A N N E L
               A N D   S E A R C H I N G   O N E   D I S C U S S I O N */
            sortify(sortModeId){
                switch(sortModeId) {
                    case 'all':
                        return this.allChats.Chats;

                    case 'messenger':
                        return this.allChats.Chats.filter(element => {
                            return element.chat.idChannel === 'messenger'
                        })

                    case 'twitter':
                        return this.allChats.Chats.filter(element => {
                            return element.chat.idChannel === 'twitter'
                        })

                    case 'whatsapp':
                        return this.allChats.Chats.filter(element => {
                            return element.chat.idChannel === 'whatsapp'
                        })

                    case 'sms':
                        return this.allChats.Chats.filter(element => {
                            return element.chat.idChannel === 'sms'
                        })

                    case 'phoneMsg':
                        return this.allChats.Chats.filter(element => {
                            return element.chat.idChannel === 'phoneMsg'
                        })

                    case 'email':
                        return this.allChats.Chats.filter(element => {
                            return element.chat.idChannel === 'email'
                        })

                    case 'search':
                        return this.allChats.Chats.filter(element => {
                            return element.chat.fullname.toLowerCase().includes(this.discussionName.toLowerCase())
                        })

                    case 'status':
                        if(this.currentStatus === 'all'){
                            return this.allChats.Chats
                        }else{
                            return this.allChats.Chats.filter(element => {
                                return element.chat.statusId === this.currentStatus
                            })
                        }
                        
                    default :
                        return ''
                }
            },

            /* A C T I V E   D I S C U S S I O N */
            isActive(idDiscussion){
                return this.active === idDiscussion
            },

            /* C H A N N E L   D I S C U S S I O N S   C O U N T */
            channeDiscussionsCount(id){
                if(id === 'all'){
                    return this.allChats.Chats.length
                } else {
                    return this.allChats.Chats.filter(disc => {
                        return disc.chat.idChannel.toLowerCase() === id.toLowerCase()
                    }).length
                }
            },

            /* S T A T U S   B A D G E  C O U N T */
            statusBadgeCount(id){
                if(id != 'all')
                return this.allChats.Chats.filter(disc => {
                        return disc.chat.statusId.toLowerCase() === id.toLowerCase()
                    }).length
            },

            /* A C T I V E   S T A T U S */
            isActiveStatus(idStatus){
                return this.currentStatus === idStatus
            },

            /* S E N D I N G   M E S S A G E */
            send(message, receiver){
                let current = new Date()
                let options = {hourCycle:"h24", weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit', second: '2-digit'}
                /* console.log(message, receiver, current, options) */
                this.allChats.Chats.filter(disc => {
                    return disc.chat.fullname === receiver
                })[0].chat.messages.push({
                    "text": message,
                    "author": 'Me',
                    "date": current.toLocaleDateString('en-US', options)
                })
                this.message = ''
                return this.allChats.Chats
            },

            /* I M A G E   P R E V I E W   M E T H O D S */
            selectImage () {
                this.$refs.fileInput.click()
            },

            pickFile () {
                let input = this.$refs.fileInput
                let file = input.files
                if (file && file[0]) {
                    let reader = new FileReader
                    reader.onload = e => {
                        this.previewImage = e.target.result
                    }
                    reader.readAsDataURL(file[0])
                    this.$emit('input', file[0])
                }
            }
        }
    }
</script>

<style scoped>
    /* ------------------------------------------------------ I M A G E   P R E V I E W   C S S ------------------------------------------------------- */
    .imagePreviewWrapper {
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        width: 70vw;
        height: 80vh;
        display: block;
        cursor: pointer;
        margin: auto auto;
        background-size: cover;
        background-position: center center;
    }

    .imageBox{
        position: fixed;
        height: 100vh;
        width: 100vw;
        left: 0;
        z-index: 1040;
        backdrop-filter: blur(5px);
        -webkit-backdrop-filter: blur(5px);
    }

    .send__button{
        bottom: 20px;
        margin-left: 45vw;
    }



    /* ------------------------------------------------------ C O M M O N   E L E M E N T S   C S S -------------------------------------------------------- */


    
    /* C U R S O R   P O I N T E R */
    .cursor__pointer{
        cursor: pointer;
    }

    /* B O R D E R   A C T I V E   F O R   A C T I V E
       D I S C U S S S I O N   A N D   S T A T U S */
    .border__active{
        border-bottom: solid 2px #395BB6;
    }

    /* T E X T   M U T E D   F O R   O P E N E D   D I S C U S S I O N */
    .text__muted{
        color: #C4C4C4;
    }

    /* L I G H T   G R A Y   B A C K G R O U N D */
    .bg__gray{
        background: rgba(219, 219, 219, 0.36);
    }

    /* T E X T   G R A Y */
    .text__gray{
        color: #B6B6B6;
    }

    .text__blue{
        color: #395BB6;
    }

    .font__12{
        font-size: 12px;
    }

    .font__11{
        font-size: 11px;
    }

    .font__10{
        font-size: 10px;
    }

    .w__100{
        width: 100%;
    }

    /* F O R M ' S   I N P U T S   P L A C E H O L D E R */
    ::-webkit-input-placeholder { /* WebKit, Blink, Edge */
        font-size: 12px;
        color: #C4C4C4;
    }
    :-moz-placeholder { /* Mozilla Firefox 4 to 18 */
        font-size: 12px;
        color: #C4C4C4;
        opacity:  0.5;
    }
    ::-moz-placeholder { /* Mozilla Firefox 19+ */
        font-size: 12px;
        color: #C4C4C4;
        opacity:  0.5;
    }
    :-ms-input-placeholder { /* Internet Explorer 10-11 */
        font-size: 12px;
        color: #C4C4C4;
    }
    ::-ms-input-placeholder { /* Microsoft Edge */
        font-size: 12px;
        color: #C4C4C4;
    }
    ::placeholder { /* Most modern browsers support this now. */
        font-size: 12px;
        color: #C4C4C4;
    }



    /* --------------------------------------------------------- S I D E B A R   Z O N E   C S S --------------------------------------------------------- */



    /* S I D E B A R */
    #all__chats{
        width: 31vw;
        height: 113%;
        position: absolute;
    }

    /* S I D E B A R ' S   L E F T   S I D E */
    #sidebar__left__side{
        height: 100%;
        width: 60px;
    }

    /* S I D E B A R ' S   R I G H T   S I D E */
    #sidebar__right__side{
        width: 85%;
        margin-left: 60px;
    }

    /* C H A N N E L S   B O X */
    #chat__channels__box{
        height: 78vh;
        width: 100%;
    }

    .channel__badge{
        height: 18px;
        width: 18px;
        left: 30px;
        top: 13px;
    }

    /* S E A R C H   B A R   B O X */
    .searchbar__box{
        width: 25vw;
        position: fixed;
        z-index:999;
    }

    /* S E A R C H   B A R   I C O N */
    .search__icon{
        height: 5px;
        width: 5px;
    }

    /* S E A R C H B A R   W I D T H */
    input[type=search]{
        width: 85%;
        font-size: 13px;
    }

    /* N O   B O R D E R   O N   F O C U S I N G   S E A R C H   B A R */
    input[type=search]:focus{
        outline: none;
    }

    /* S T A T U S   B O X */
    .status__box{
        width: 25vw;
        margin-top: 45px;
        position: fixed;
        z-index:999;
    }

    /* C H A T S   S T A T U S   T I T L E */
    .status__title{
        font-size: 11px;
    }

    /* C H A T S   S T A T U S   T I T L E   B A D G E */
    .status__title__badge{
        height: 20px;
        width: 20px;
    }

    /* A L L   C H A T S */
    .all__discussions{
       margin-top: 60px;
    }

    /* D I S C U S S I O N   B O X */
    .discussion__box{
        width: 93%;
        height: 75px;
    }

    /* D I S C U S S I O N   C H A N N E L   B A D G E */
    .group__badge{
        height: max-content;
        width: max-content;
        bottom: 24px;
        left: -7px;
    }

    /* D I S C U S S I O N   N A M E   A N D   M E S S A G E   B O X */
    .discussion__name__message{
        width: 60%;
    }

    /* D I S C U S S I O N   N A M E */
    .discussion__name{
        font-size: 12px;
    }

    /* D I S C U S S I O N   M E S S A G E */
    .discussion__message{
        height: 65%;
        font-size: 12px;
        line-height: 13px;
    }

    /* D I S C U S S I O N   D A T E   A N D 
       M E S S A G E   C O U N T   B A D G E */
    .discussion__date__badge{
        width: 8%;
    }

    /* D I S C U S S I O N   D A T E */
    .discussion__date{
        font-size: 12px;
        color: #C4C4C4;
    }

    /* D I S C U S S I O N   B A D G E */
    .discussion__badge{
        height: 17px;
        width: 17px;
        font-size: 0.6rem;
    }



    /* -------------------------------------------------------- C H A T   Z O N E   C S S --------------------------------------------------------- */
    


    /* C H A T   Z O N E */
    .chat__zone{
        position: fixed;
        height: 100vh;
        width: 68.97%;
        right: 0;
    }

    /* C H A T   Z O N E   H E A D E R */
    .chat__zone__header{
        height: 46px;
    }

    /* U S E R   F U L L N A M E*/
    .user__fullname{
        font-size: 12px;
        font-weight: bold;
    }

    /* U S E R   S T A T U S */
    .user__status{
        font-weight: lighter;
        font-size: 10.5px;
        color: #C4C4C4;
    }

    /* O P T I O N S   I C O N S */
    .option__icon{
        color: #C4C4C4;
    }

    /* C H A T   Z O N E   C O N T A I N E R */
    .chat__zone__container{
        height: 93vh;
    }

    /* I N V I T A T I O N   F R A M E */
    .invitation__frame{
        width: 22vw;
        height: 30vh;
        margin-top: 150px;
    }

    /* I N V I T A T I O N   P A R A G R A P H */
    .invitation__paragraph{
        font-size: 12px;
        color: #979797;
    }

    /* D E C I S I O N   B U T T O N S */
    .decision__button{
        height: 50px;
        width: 50px;
    }

    /* A C C E P T   I N V I T A T I O N */
    .decision__accept{
        background: #395BB6;
    }

    /* R E J E C T   I N V I T A T I O N */
    .decision__reject{
        background: #ED1818;
    }

    /* M E S S A G E S   F R A M E */
    .messages__frame{
        height: 70vh;
        /* width:68.5%;
        top: 47px;
        bottom: 25%;
        right: 5px; 
        position:fixed;*/
        overflow-y:scroll;
        overflow-x:hidden;
    }

    /* C H A T   M E S S A G E S */
    .chat__message{
        font-size: 12px;
        font-weight: bolder;
        max-width: 250px;
        white-space: nowrap;
    }

    .message__hour{
        font-size: 11px;
        color: #979797;
    }

    .message__right{
        background: #395BB6;
        color: white;
        border-top-left-radius: 10px;
        border-bottom-left-radius: 10px;
        border-top-right-radius: 10px;
    }

    .message__left{
        background: #F0F0F7;
        border-top-right-radius: 10px;
        border-bottom-right-radius: 10px;
        border-top-left-radius: 10px;
    }

    .chat__img{
        bottom: 50px;
        right: 60px;
    }

    /* T E X T   -   R E S P O N S E   -   E M O T I C O N S */
    .message__mode{
        width: 96%;
        bottom: 12vh;
        left: 1vw;
        padding-right: 80px;
        z-index: 10;
    }

    /* T E X T   Z O N E */
    .text__zone{
        position: relative;
        bottom: 0;
        height: 18%;
        z-index: 9;
    }

    /* T E X T   A R E A */
    .text__zone__textarea{
        width: 100%;
    }

    /* T Y P I N G   Z O N E */
    .textarea__typing{
        background: #F6F6F6;
        font-size: 12px;
    }

    /* M E S S A G E   A R E A */
    .message__area{
        background: #F6F6F6;
        resize: none;
        width: 81%;
    }

    .message__area:focus{
        outline: none;
    }

    /* S E N D I N G   B U T T O N   B O X */
    .text__zone__send{
        width: 7%;
        height: 90%;
       
    }

    /* S E N D I N G   B U T T O N */
    .sending__button{
        background: #395BB6;
        width: 48px;
        height: 48px;
        margin-top: 3px;
    }


    
    /* -------------------------------------------------------- C H A T   D E T A I L S -------------------------------------------------------- */



    /* D E T A I L S   B O X */
    .chat__details{
        width: 25vw;
        z-index: 999;
    }

    /* P E R S O N S   D E T A I L S */
    .person__details{
        height: 60px;
    }

    /* U S E R   C O N T A C T */
    .user__contact{
        width: 80%;
    }

    /* C O N T A C T   F U L L N A M E , 
       N U M B E R   A N D   E M A I  L   A D D R E S S */
    .contact__fullname, .contact__number, .contact__email{
        font-size: 11px;
    }

    .contact__number, .contact__email{
        color: #C4C4C4;
    }

    /* H I S T O R Y   T I T L E   A N D   L I N K */
    .history__title__link{
        font-size: 11px;
    }

    .__badge{
        width: max-content;
    }

</style>