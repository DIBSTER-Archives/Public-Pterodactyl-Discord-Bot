const { SlashCommandBuilder } = require('@discordjs/builders');
const DiscordJS = require('discord.js');
const UserAccounts = require('../../Database/UserAccounts.js');
const bycrypt = require('bcrypt');
const Axios = require('axios');

const SlashCommand = new SlashCommandBuilder()
SlashCommand.setName('user-delete');
SlashCommand.setDescription('Delete your Pterodactyl Account!');

module.exports = {
data: SlashCommand.toJSON(),                                                                    
async execute(Client, Interaction) {

        const UserData = await UserAccounts.findOne({DiscordID: Interaction.user.id});

        const NoAccountEmbed = new DiscordJS.MessageEmbed()
        NoAccountEmbed.setTitle(`${Client.configuration.StaticEmotes.issue} No user account found!`);
        NoAccountEmbed.setColor('RED');
        NoAccountEmbed.setDescription('There was no panel account linked to your Discord. If you believe this is a mistake, please contact one of the Administrators.');
        NoAccountEmbed.setFooter({text: Client.user.tag, iconURL: Client.user.avatarURL({size: 4096, extension: "png"})});
        NoAccountEmbed.setTimestamp();

        if(UserData == null) return Interaction.reply({content: Interaction.user.toString(), embeds: [NoAccountEmbed]});

        await Axios({
                url: Client.configuration.Tokens.Pterodactyl.Link + '/api/application/users/' + `${UserData.ConsoleID}` + "?include=servers",
                method: 'GET',
                followRedirects: true,
                maxRedirects: 5, 
                headers: {
                        'Authorization': 'Bearer ' + Client.configuration.Tokens.Pterodactyl.APIKey,
                        'Content-Type': 'application/json',
                        'Accept': 'Application/vnd.pterodactyl.v1+json',
                }
        }).then(async Response => {
                const UserServers = Response.data.attributes.relationships.servers.data.map(x => x.attributes.id);

                const DeleteAccountEmbed = new DiscordJS.MessageEmbed();
                DeleteAccountEmbed.setTitle(`${Client.configuration.StaticEmotes.issue} Are you sure you want to delete your account?`);
                DeleteAccountEmbed.setColor('RED');
                DeleteAccountEmbed.setDescription(`You are going to delete your account with the following information:\n\n> **Username:** \`${Response.data.attributes.username}\`\n> **Console ID:** \`${Response.data.attributes.id}\`.\n> **Server Count:** \`${UserServers.length}\`\n\n**Note: Your account will be deleted, and this action is irreversible. This is your last chance to cancel.**`);
                DeleteAccountEmbed.setFooter({text: "You have 30 seconds before this will cancel!", iconURL: Client.user.avatarURL({size: 4096, extension: "png"})});
                DeleteAccountEmbed.setTimestamp();

                const DeleteAccountComponent = new DiscordJS.MessageActionRow()
                .addComponents(
                        new DiscordJS.MessageButton()
                        .setCustomId('DeleteTheAccount')
                        .setLabel('Yes')
                        .setStyle('SUCCESS'),
                )
                .addComponents(
                        new DiscordJS.MessageButton()
                        .setCustomId('CancelAccountDeletion')
                        .setLabel('No')
                        .setStyle('DANGER'),
                );

                await Interaction.reply({embeds: [DeleteAccountEmbed], components: [DeleteAccountComponent], content: Interaction.user.toString()});

                const MessageResponse = await Interaction.fetchReply();

                const Filter = i => i.user.id = Interaction.user.id;
                const Collector = MessageResponse.createMessageComponentCollector({ Filter, time: 30 * 1000 });

                Collector.on('collect', async i => {
                        i.deferUpdate()
                        if(i.customId === "DeleteTheAccount") return Collector.stop('DeleteTheAccount');
                        if(i.customId === "CancelAccountDeletion") return Collector.stop('CancelAccountDeletion');
                });

                Collector.on('end', async(a, reason) => {

                        MessageResponse.edit({
                            components:[
                                new DiscordJS.MessageActionRow()
                                        .addComponents(new DiscordJS.MessageButton().setCustomId('DeleteTheAccount').setLabel('Yes').setStyle('SUCCESS').setDisabled(true))
                                        .addComponents(new DiscordJS.MessageButton().setCustomId('CancelAccountDeletion').setLabel('No').setStyle('DANGER').setDisabled(true))
                                ]
                        });
            
            
                        if(reason === 'time'){
                                MessageResponse.edit({
                                components:[
                                    new DiscordJS.MessageActionRow()
                                        .addComponents(new DiscordJS.MessageButton().setCustomId('DeleteTheAccount').setLabel('Yes').setStyle('SUCCESS').setDisabled(true))
                                        .addComponents(new DiscordJS.MessageButton().setCustomId('CancelAccountDeletion').setLabel('No').setStyle('DANGER').setDisabled(true))
                                ]
                            });
                            return;
                        };

                        if(reason === 'CancelAccountDeletion'){
                                MessageResponse.edit({embeds:[
                                new DiscordJS.MessageEmbed()
                                .setTitle(`${Client.configuration.StaticEmotes.issue} Account deletion has been cancelled!`)
                                .setDescription('You have cancelled the deletion of your account. We thank you for staying with us.')
                                .setColor(`RED`)
                                .setFooter({text: "Glad you stayed with us!", iconURL: Client.user.avatarURL({size: 4096, extension: "png"})})
                                .setTimestamp()
                            ]});
                            return;
                        };

                        if(reason === 'DeleteTheAccount'){
                            
                            if(UserServers.length > 0){
                                await MessageResponse.edit({embeds:[
                                    new DiscordJS.MessageEmbed()
                                    .setTitle(`${Client.configuration.StaticEmotes.issue} Deleting servers . . .`)
                                    .setDescription('This should only take a few seconds!')
                                    .setColor(`RED`)
                                    .setFooter({text: "Your servers are right now being deleted.", iconURL: Client.user.avatarURL({size: 4096, extension: "png"})})
                                    .setTimestamp()
                                ]})
                                await Promise.all(UserServers.map(async server => {
                                    await Axios({
                                        url: Client.configuration.Tokens.Pterodactyl.Link + "/api/application/servers/" + server + "/force",
                                        method: 'DELETE',
                                        followRedirect: true,
                                        maxRedirects: 5,
                                        headers: {
                                            'Authorization': 'Bearer ' + Client.configuration.Tokens.Pterodactyl.APIKey,
                                            'Content-Type': 'application/json',
                                            'Accept': 'Application/vnd.pterodactyl.v1+json',
                                        }
                                    }).then(() => {}).catch(err => {return MessageResponse.edit({embeds:[
                                        new DiscordJS.MessageEmbed()
                                        .setTitle(`${Client.configuration.StaticEmotes.issue} There was an error deleting your servers. Please contact an Administrator to look into the issue.`)
                                        .setColor(`RED`)
                                        .setFooter({text: "Well this is unexpected!", iconURL: Client.user.avatarURL({size: 4096, extension: "png"})})
                                        .setTimestamp()
                                    ]})})
                                }))
                            }
            
                            await MessageResponse.edit({embeds:[
                                new DiscordJS.MessageEmbed()
                                .setTitle(`${Client.configuration.StaticEmotes.issue} Deleting The Account . . .`)
                                .setColor(`RED`)
                                .setFooter({text: "Your account is right now being deleted.", iconURL: Client.user.avatarURL({size: 4096, extension: "png"})})
                                .setTimestamp()
                            ]})
            
                            await Axios({
                                url: Client.configuration.Tokens.Pterodactyl.Link + "/api/application/users/" + UserData.ConsoleID,
                                method: 'DELETE',
                                followRedirect: true,
                                maxRedirects: 5,
                                headers: {
                                    'Authorization': 'Bearer ' + Client.configuration.Tokens.Pterodactyl.APIKey,
                                    'Content-Type': 'application/json',
                                    'Accept': 'Application/vnd.pterodactyl.v1+json',
                                }
                            }).then(async () => {
                                await UserAccounts.findOneAndDelete({ConsoleID: UserData.ConsoleID}).catch(console.error);
            
            
                                MessageResponse.edit({
                                    embeds:[
                                        new DiscordJS.MessageEmbed()
                                        .setTitle(`${Client.configuration.StaticEmotes.online} Account Deleted Successfully!`)
                                        .setColor(`GREEN`)
                                        .setDescription('Your account has successfully been deleted. Your panel account has been deleted as well as your servers, and your information has been deleted from our hashed database.')
                                        .setFooter({text: "Sorry to see you go, don't go to FalixNodes though.", iconURL: Client.user.avatarURL({size: 4096, extension: "png"})})
                                        .setTimestamp()
                                    ]
                                })
                                
                            }).catch(Error => {
                                MessageResponse.edit({
                                    embeds:[
                                        new DiscordJS.MessageEmbed()
                                        .setTitle(`${Client.configuration.StaticEmotes.issue} There was an error deleting your account. Please contact an Administrator to look into the issue.`)
                                        .setColor(`RED`)
                                        .setDescription(`ERROR!`)
                                        .setFooter({text: "Well this is unexpected!", iconURL: Client.user.avatarURL({size: 4096, extension: "png"})})
                                        .setTimestamp()
                                    ]
                                });

                                console.log(Error);
                            });
                        };
                    });
        });

        return;
	},
};