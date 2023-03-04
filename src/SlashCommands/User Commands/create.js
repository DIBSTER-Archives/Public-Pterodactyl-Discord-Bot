const { SlashCommandBuilder } = require('@discordjs/builders');
const DiscordJS = require('discord.js');
const UserAccounts = require('../../Database/UserAccounts.js');
const bycrypt = require('bcrypt');
const CreateUser = require('../../Utilities/Pterodactyl/User/create.js');

const SlashCommand = new SlashCommandBuilder()
SlashCommand.setName('user-create');
SlashCommand.setDescription('Create a Pterodactyl Account!');

const emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
const userRegex = /^[a-zA-Z0-9_]+$/;

const PasswordGenerator = (length) => {
    const CHARS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let Password = "";

    for (let i = 0; i < length; i++) {
        Password += CHARS.charAt(Math.floor(Math.random() * CHARS.length));
    };

    return Password;
};

module.exports = {
data: SlashCommand.toJSON(),                                                                    
async execute(Client, Interaction) {
    if(Interaction.user.id == 529433085473849356) return Interaction.reply({content: "I coded this hoping to never see it show up in Discord. If you see this on Discord, Bimi thought it was a good idea to play with my bot. What a clown."});

    if(Interaction.user.id != 757296951925538856) return Interaction.reply({content: "Boy get yo hands off my bot, evil."});

    const UserCreationCategory = Client.channels.cache.get(Client.configuration.DiscordCategories.UserCreation);

    if(!UserCreationCategory){
        Interaction.reply('The account creation category was not found, please contact a Administrator regarding this issue.');
    };

    const UserData = await UserAccounts.findOne({DiscordID: Interaction.user.id}).exec();

    if(UserData != null) return Interaction.reply({content: `You already have a panel account.`});

    const Account_Channel = await UserCreationCategory.createChannel(`${Interaction.user.username}-${Interaction.user.discriminator}`, {
        type: "text",
        permissionOverwrites: [
            {
                id: Interaction.guildId,
                deny: ["VIEW_CHANNEL", "SEND_MESSAGES"],
            }, {
                id: Interaction.user.id,
                allow: ["VIEW_CHANNEL", "SEND_MESSAGES", "READ_MESSAGE_HISTORY"],
            }
        ]
    }).catch(console.error);

    Interaction.reply(`Please check your account creation ticket at ${Account_Channel.toString()} to create your account.`);

    let Questions = [{
        question: "What is your email?",
        time: 300000,
        value: null,
        afterChecks: [{
            check: (value) => emailRegex.test(value),
            message: "Please enter a valid email!",
        }]
    }, {
        question: "What is your username? (Username Can Only Include from a-z, A-Z, 0-9, _)",
        time: 300000,
        value: null,
        afterChecks: [{
            check: (value) => userRegex.test(value),
            message: "Please enter a valid username!"
        }]
    }]

    let CreationEmbed = new DiscordJS.MessageEmbed()
        .setColor("GREEN")
        .setTitle(`${Interaction.user.tag} account creation ticket!`)
        .setTimestamp()
        .setFooter({text: "You can type 'cancel' to cancel the creation process!", iconURL: Client.user.avatarURL({size: 4096, extension: "png"})});

    const msg = await Account_Channel.send({ content: `${Interaction.user.toString()}`, embeds: [CreationEmbed] });

    for (const question of Questions) {

        CreationEmbed.description = question.question;

        await msg.edit({ embeds: [CreationEmbed] });

        const collectedMsgs = await Account_Channel.awaitMessages({
            filter: m => m.author.id === Interaction.user.id,
            time: question.time,
            max: 1,
        });

        const collectedMsg = collectedMsgs?.first()?.content?.trim();

        if (collectedMsgs?.first()) collectedMsgs?.first()?.delete();

        if (!collectedMsg) {
            Account_Channel.send("You took too long to answer the question!");
            Account_Channel.send(`Account creation failed!`);

            setTimeout(() => {
                Account_Channel.delete();
            }, 5000);
            return;
        }

        if (collectedMsg.toLowerCase() === "cancel") {
            Account_Channel.send("You have cancelled the creation process!");
            setTimeout(() => {
                Account_Channel.delete();
            }, 5000);
            return;
        }

        question.value = collectedMsg;

        for (const check of question.afterChecks) {
            if (!check.check(question.value)) {
                Account_Channel.send(check.message);
                Account_Channel.send(`Account creation failed!`);

                setTimeout(() => {
                    Account_Channel.delete();
                }, 5000);

                return;
            }
        }

    };

    const Salt = await bycrypt.genSalt(15);

    const Hash = await bycrypt.hash(Questions[0].value, Salt);

    const EmailCheck = await UserAccounts.findOne({ Email: Hash });
    const UsernameCheck = await UserAccounts.findOne({ Username: Questions[1].value });

    if (EmailCheck) {
        Account_Channel.send("That email is already in use! Please link your account instead!");
        Account_Channel.send(`Account creation failed!`);

        setTimeout(() => {
            Account_Channel.delete();
        }, 5000);
        return;
    };

    if (UsernameCheck) {
        Account_Channel.send("That username is already in use! Please try another username!");
        Account_Channel.send(`Account creation failed!`);

        setTimeout(() => {
            Account_Channel.delete();
        }, 5000);
        return;
    };

    const UserAccountCreationData = {
        "username": Questions[1].value.toLowerCase(),
        "email": Questions[0].value,
        "first_name": Interaction.user.tag,
        "last_name": Interaction.user.id,
        "password": PasswordGenerator(12),
        "root_admin": false,
        "language": "en"
    };

    CreationEmbed.setDescription(`${Client.configuration.StaticEmotes.idle} Creating your account please wait...`);
    CreationEmbed.setFooter({text: "You can type 'cancel' to cancel the creation process!", iconURL: Client.user.avatarURL({size: 4096, extension: "png"})});

    await msg.edit({ embeds: [CreationEmbed] });

    const ResponseData = await CreateUser(UserAccountCreationData);

    if (ResponseData.error) {
        Account_Channel.send(`Account creation failed!\n\n${ResponseData.data}`);

        setTimeout(() => {
            Account_Channel.delete();
        }, 5000);
        return;
    }

    await UserAccounts.create({
        Email: Hash,
        Username: Questions[1].value,
        FirstName: ResponseData.data.attributes.first_name,
        LastName: ResponseData.data.attributes.last_name,
        ConsoleID: ResponseData.data.attributes.id,
        DiscordID: ResponseData.data.attributes.last_name,
        TimeSaved: Date.now(),
        PremiumServers: 0,
        NormalServers: 0,
        Domains: []
    });

    const AccountLogEmbed = new DiscordJS.MessageEmbed();
    AccountLogEmbed.setColor("GREEN");
    AccountLogEmbed.setTitle("New user account created.");
    AccountLogEmbed.setDescription(`${Interaction.user.toString()} has created an account on ${Client.configuration.Tokens.Pterodactyl.Link} right now.`);
    AccountLogEmbed.addField("Username", Questions[1].value.toString(), true);
    AccountLogEmbed.addField("Discord User:", `${Interaction.user.tag} (${Interaction.user.id})`, true);
    AccountLogEmbed.addField("Timestamp:", `<t:${Math.round(Date.now()/1000)}:F>`);
    AccountLogEmbed.addField("Account Username:", `${Questions[1].value}`);
    AccountLogEmbed.setTimestamp();
    AccountLogEmbed.setFooter({text: `${Interaction.user.tag} (${Interaction.user.id}) has created an account.`, iconURL: `${Client.user.avatarURL({size: 4096, extension: 'png'})}`});

    const Account_Logging_Channel = Interaction.guild.channels.cache.get(Client.configuration.DiscordChannels.AccountLogging);

    if (Account_Logging_Channel) {
        Account_Logging_Channel.send({ embeds: [AccountLogEmbed] });
    };

    CreationEmbed.addField('Panel Link:', Client.configuration.Tokens.Pterodactyl.Link);
    CreationEmbed.addField('Username:', UserAccountCreationData.username);
    CreationEmbed.addField('Email Address:', `||${UserAccountCreationData.email}||`);
    CreationEmbed.addField('Password:', `||${UserAccountCreationData.password}||`);
    CreationEmbed.setDescription(`${Client.configuration.StaticEmotes.online} Your account has successfully been created!`);
    CreationEmbed.setFooter({ text: `Please check your direct message for your password!`, iconURL: Client.user.avatarURL({size: 4096, extension: 'png'})});

    await msg.edit({ embeds: [CreationEmbed] });
    Interaction.user.send({ embeds: [CreationEmbed] });

    Interaction.member.roles.add(Client.configuration.DiscordRoles.Client).catch(console.error);

    setTimeout(() => {
        Account_Channel.delete();
    }, 6 * 100 * 1000);

    return;
	},
};