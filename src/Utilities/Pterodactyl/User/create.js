const Configuration = require('../../../Configuration/config.json');
const Axios = require("axios");

const CreateUser = async (UserData) => {
    try {
        const Response = await Axios({
            url: `${Configuration.Tokens.Pterodactyl.Link}/api/application/users`,
            method: "POST",
            followRedirect: true,
            maxRedirects: 5,
            headers: {
                'Authorization': `Bearer ${Configuration.Tokens.Pterodactyl.APIKey}`,
                'Content-Type': 'application/json',
                'Accept': 'Application/vnd.pterodactyl.v1+json',
            },
            data: UserData
        });
        return {
            error: false,
            data: Response.data
        };
    } catch (Error) {
        return {
            error: true,
            data: Error?.response?.data?.message
        };
    };
}

module.exports = CreateUser;