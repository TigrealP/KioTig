const { 
    SlashCommandBuilder, 
    EmbedBuilder, 
    ActionRowBuilder, 
    StringSelectMenuBuilder 
} = require('discord.js');

const NOVIO_ID = '811091271023722586';
const TU_ID = '765660693835415552';

let moodsBase = [
    {
        name: 'Celoso 😡',
        description: (author) => `Oh! al parecer ${author} está celoso hoy 🐯🐶`,
        image: ['https://i.pinimg.com/736x/b7/9e/4a/b79e4a4e5834527efcce568d6424101a.jpg',
                'https://i.pinimg.com/736x/fd/4d/c3/fd4dc39da009dd301b1fa9ba99ea7dd2.jpg',
                'https://i.pinimg.com/736x/e4/f5/96/e4f5962deac1be58323fbba797b2bd61.jpg',
                'https://i.pinimg.com/736x/49/aa/a1/49aaa1161abd66053da68b99295f068b.jpg']
    },
    {
        name: 'Mimoso 🐯🧡🐶',
        description: (author) => `${author} se siente mimoso hoy, ven y dale cariñito! 🐯🐶`,
        image: ['https://i.pinimg.com/736x/23/15/7a/23157ac5cbbd11e1452264585de7191e.jpg',
                'https://i.pinimg.com/736x/10/b0/14/10b014db5c92dc1e8ff992e5fc3a68df.jpg',
                'https://i.pinimg.com/736x/fc/6d/72/fc6d72934345638163d8daa46078474e.jpg',
                'https://i.pinimg.com/736x/ff/00/d7/ff00d711875a47235100f390ccff5d26.jpg',
                'https://i.pinimg.com/1200x/9f/22/4c/9f224c082e9101854485aac41928d942.jpg']
    },
    {
        name: 'Needy 🥀',
        description: (author) => `Al parecer ${author} siente que lo tienes descuidado y necesita atención extra hoy 🐯🐶`,
        image: ['https://i.pinimg.com/736x/38/6a/6c/386a6c208e06f5764de42acfe9876632.jpg',
                'https://i.pinimg.com/736x/12/a5/77/12a5777a7656e46a0f5872d297002268.jpg',
                'https://i.pinimg.com/736x/a8/a3/84/a8a384a0c5941855efe0e45a275ba953.jpg',
                'https://i.pinimg.com/736x/58/64/4a/58644aed2b86b0ea2469dadba160c824.jpg']
    }
];

let dominanteMood = {
    name: 'Dominante 🐯',
    description: (author) => `${author} hoy quiere que le obedezcas sin cuestionar, <@${NOVIO_ID}> 🐯`,
    image: ['https://media.discordapp.net/attachments/1477732500108480755/1477756132612374529/zunzunhu_-_6063057.jpg?ex=69a5eb25&is=69a499a5&hm=becc12cb428dcd0a76cc68d5de8486baee956fcd03d94b5d1f9ad306dbf8949a&=&format=webp&width=571&height=712',
            'https://media.discordapp.net/attachments/1477732500108480755/1477756133094723856/fuyifuji_-_6074432.jpg?ex=69a5eb25&is=69a499a5&hm=b7393f8d112fcb526b0f4b3acf8242933d808ae8f70f2290bf138919d8eaa858&=&format=webp&width=605&height=712',
            'https://media.discordapp.net/attachments/1477732500108480755/1477756133442589003/deaddragonp_-_5486452.jpg?ex=69a5eb25&is=69a499a5&hm=d26831698a51c15ede6f406a400ab1f2a0b8eceb40c6c63690372dbf6e588524&=&format=webp&width=1029&height=712',
            'https://media.discordapp.net/attachments/1477732500108480755/1477756133967135025/physen_-_4979704.jpg?ex=69a5eb25&is=69a499a5&hm=3593e9e34dda10725b25b0384b6545eddf09db7fe0178146ab314205156a293c&=&format=webp&width=602&height=712',
            'https://media.discordapp.net/attachments/1477732500108480755/1477756134319460423/purtropos_-_6201146.jpg?ex=69a5eb25&is=69a499a5&hm=e0be868f4d8086815ec396fa8f6a95de9cd37bf5eeb1673293df0f3d73bc79e6&=&format=webp&width=809&height=712',
            'https://media.discordapp.net/attachments/1477732500108480755/1477756194549403678/koko2unite_-_6074238.jpg?ex=69a5eb34&is=69a499b4&hm=7f42e9e622fbbe37db0d4ed6e33cedbac43aeadb0c8755a1fc8a18f882424deb&=&format=webp&width=300&height=712',
            'https://media.discordapp.net/attachments/1477732500108480755/1477756194872627280/koutanagamori_venterno_anthroworks_-_6000097.jpg?ex=69a5eb34&is=69a499b4&hm=1a8a99ccfc4b5a6d39d7376f5e71c2fe414e10a2b66a55693fcdc8cb3746801d&=&format=webp&width=897&height=712']
};

let sumisoMood = {
    name: 'Sumiso 🐶',
    description: (author) => `${author} hoy está especialmente obediente y esperando tus órdenes <@${TU_ID}> 🐶`,
    image: [
        'https://media.discordapp.net/attachments/1477732500108480755/1477756074319937667/G3e_qqkXcAA6c_x.png?ex=69a5eb17&is=69a49997&hm=a07e044b2e26c1e39323d2a651c67efe08fc7946fdf227e55740dcdcde5fcfc7&=&format=webp&quality=lossless&width=712&height=712',
        'https://media.discordapp.net/attachments/1477732500108480755/1477756074621796484/20260301_144929.jpg?ex=69a5eb17&is=69a49997&hm=fe213e3825ca6a80e0d092db4a5e5eeced41b4c30f2d1b9b2f8afdb8cbc206ed&=&format=webp&width=534&height=712',
        'https://media.discordapp.net/attachments/1477732500108480755/1477756074894295130/20260301_144849.jpg?ex=69a5eb17&is=69a49997&hm=2007497cb925b610945361e783b2df0d0b13762bf51ac31e2cbb822af70f6c81&=&format=webp&width=857&height=712',
        'https://media.discordapp.net/attachments/1477732500108480755/1477756075854921898/openfracturesday_-_5467856.png?ex=69a5eb17&is=69a49997&hm=3e9ed471ac1c722114c19c8efb46059dc44d402fb5d02def39e6262187501d31&=&format=webp&quality=lossless&width=712&height=712',
        'https://media.discordapp.net/attachments/1477732500108480755/1477756076374884402/aennor_-_5344646.png?ex=69a5eb17&is=69a49997&hm=1ca70065892ee7000322a9784b15dee83c2c52be93e1bd1618e941d7b828bca9&=&format=webp&quality=lossless&width=491&height=712',
        'https://media.discordapp.net/attachments/1477732500108480755/1477756076769153218/nikitayarrow_-_5448447.jpg?ex=69a5eb18&is=69a49998&hm=7eff459aaa240f7598b1052e5aad917e58dfce229f4c925be05fa356c62eba92&=&format=webp&width=712&height=712',
        'https://media.discordapp.net/attachments/1477732500108480755/1477756077079658606/kamyuelo_-_5527528.jpg?ex=69a5eb18&is=69a49998&hm=976d2212a02441025968e8dcb41c81eb59c94f8bb4ebcdc341d76ca7d84f80d5&=&format=webp&width=561&height=712',
        'https://media.discordapp.net/attachments/1477732500108480755/1477756077951942676/brownh0und_-_6190929.png?ex=69a5eb18&is=69a49998&hm=85f33e97b718f89952d491bc3a47679d6f7e04f0b81c06487cb4d6bf9adba301&=&format=webp&quality=lossless&width=554&height=711',
        'https://media.discordapp.net/attachments/1477732500108480755/1477756078262583347/20260301_143909.jpg?ex=69a5eb18&is=69a49998&hm=271e2c70021ff2d49110b9c302c0e118affb2f66cd5c0bf6fedca474bf1e32f8&=&format=webp&width=1032&height=712',
        'https://media.discordapp.net/attachments/1477732500108480755/1477756078858047538/20260301_143858.jpg?ex=69a5eb18&is=69a49998&hm=78fba69fc0de4ea9a60a13823637dc0b80a70b775b46f24fd17d2b56f5997c5d&=&format=webp&width=951&height=712'
    ],
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mood')
        .setDescription('Selecciona el estado emocional de tu tigre o cachorrito 🐯🐶'),

    async execute(interaction) {
        const author = interaction.user;

        let availableMoods = [...moodsBase];

        if (author.id === TU_ID) {
            availableMoods.push(dominanteMood);
        }

        if (author.id === NOVIO_ID) {
            availableMoods.push(sumisoMood);
        }

        const menu = new StringSelectMenuBuilder()
            .setCustomId('select-mood')
            .setPlaceholder('Selecciona un mood...')
            .addOptions(
                availableMoods.map(mood => ({
                    label: mood.name,
                    description: `Mood: ${mood.name}`,
                    value: mood.name
                }))
            );

        const row = new ActionRowBuilder().addComponents(menu);

        await interaction.reply({
            content: 'Elige el mood que quieres activar 🐯🐶',
            components: [row]
        });

        const collector = interaction.channel.createMessageComponentCollector({
            filter: i => i.user.id === author.id,
            time: 60000
        });

        collector.on('collect', async i => {
            const selected = availableMoods.find(m => m.name === i.values[0]);

            let roleText = 'Hoy está...';

            if (author.id === NOVIO_ID) {
                roleText = 'Tu cachorrito hoy está...';
            }

            if (author.id === TU_ID) {
                roleText = 'Tu dueño hoy está...';
            }

            const embed = new EmbedBuilder()
                .setColor('#8b0808')
                .setTitle(`${roleText} ${selected.name} 🐶🧡🐯`)
                .setAuthor({
                    name: interaction.client.user.username,
                    iconURL: interaction.client.user.displayAvatarURL()
                })
                .setDescription(
                    typeof selected.description === 'function'
                        ? selected.description(author)
                        : selected.description
                )
                .setThumbnail(author.displayAvatarURL({ dynamic: true }))
                .setImage(selected.image[Math.floor(Math.random() * selected.image.length)])
                .setFooter({
                    text: 'Independientemente de como se sienta, estoy seguro que quiere todo tu amor 🐯❤️🐶'
                })
                .setTimestamp();

            await i.update({
                content: '',
                embeds: [embed],
                components: []
            });

            collector.stop();
        });
    }
};