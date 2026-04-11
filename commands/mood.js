const { updateHappiness, updateStreak } = require('../utils/happiness');
const Relationship = require('../models/relationship');
const User = require('../models/User');

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
        id: 'celoso',
        name: 'Celoso 😡',
        description: (author) => `Oh! al parecer ${author} está celoso hoy 🐯🐶`,
        image: ['https://i.pinimg.com/736x/b7/9e/4a/b79e4a4e5834527efcce568d6424101a.jpg',
            'https://i.pinimg.com/736x/fd/4d/c3/fd4dc39da009dd301b1fa9ba99ea7dd2.jpg',
            'https://i.pinimg.com/736x/e4/f5/96/e4f5962deac1be58323fbba797b2bd61.jpg',
            'https://i.pinimg.com/736x/49/aa/a1/49aaa1161abd66053da68b99295f068b.jpg']
    },
    {
        id: 'mimoso',
        name: 'Mimoso 🐯🧡🐶',
        description: (author) => `${author} se siente mimoso hoy, ven y dale cariñito! 🐯🐶`,
        image: ['https://i.pinimg.com/736x/23/15/7a/23157ac5cbbd11e1452264585de7191e.jpg',
            'https://i.pinimg.com/736x/10/b0/14/10b014db5c92dc1e8ff992e5fc3a68df.jpg',
            'https://i.pinimg.com/736x/fc/6d/72/fc6d72934345638163d8daa46078474e.jpg',
            'https://i.pinimg.com/736x/ff/00/d7/ff00d711875a47235100f390ccff5d26.jpg',
            'https://i.pinimg.com/1200x/9f/22/4c/9f224c082e9101854485aac41928d942.jpg']
    },
    {
        id: 'needy',
        name: 'Needy 🥀',
        description: (author) => `Al parecer ${author} siente que lo tienes descuidado y necesita atención extra hoy 🐯🐶`,
        image: ['https://i.pinimg.com/736x/38/6a/6c/386a6c208e06f5764de42acfe9876632.jpg',
            'https://i.pinimg.com/736x/12/a5/77/12a5777a7656e46a0f5872d297002268.jpg',
            'https://i.pinimg.com/736x/a8/a3/84/a8a384a0c5941855efe0e45a275ba953.jpg',
            'https://i.pinimg.com/736x/58/64/4a/58644aed2b86b0ea2469dadba160c824.jpg']
    }
];

let dominanteMood = {
    id: 'dominante',
    name: 'Dominante 🐯',
    description: (author) => `${author} hoy quiere que le obedezcas sin cuestionar, <@${NOVIO_ID}> 🐯`,
    image: ['https://media.discordapp.net/attachments/1477732500108480755/1477756132612374529/zunzunhu_-_6063057.jpg?ex=69a5eb25&is=69a499a5&hm=becc12cb428dcd0a76cc68d5de8486baee956fcd03d94b5d1f9ad306dbf8949a&=&format=webp&width=571&height=712',
        'https://media.discordapp.net/attachments/1477732500108480755/1477756133094723856/fuyifuji_-_6074432.jpg?ex=69a5eb25&is=69a499a5&hm=b7393f8d112fcb526b0f4b3acf8242933d808ae8f70f2290bf138919d8eaa858&=&format=webp&width=605&height=712',
        'https://media.discordapp.net/attachments/1477732500108480755/1477756133442589003/deaddragonp_-_5486452.jpg?ex=69a5eb25&is=69a499a5&hm=d26831698a51c15ede6f406a400ab1f2a0b8eceb40c6c63690372dbf6e588524&=&format=webp&width=1029&height=712',
        'https://media.discordapp.net/attachments/1477732500108480755/1477756133967135025/physen_-_4979704.jpg?ex=69a5eb25&is=69a499a5&hm=3593e9e34dda10725b25b0384b6545eddf09db7fe0178146ab314205156a293c&=&format=webp&width=602&height=712',
        'https://media.discordapp.net/attachments/1477732500108480755/1477756134319460423/purtropos_-_6201146.jpg?ex=69a5eb25&is=69a499a5&hm=e0be868f4d8086815ec396fa8f6a95de9cd37bf5eeb1673293df0f3d73bc79e6&=&format=webp&width=809&height=712',
        'https://media.discordapp.net/attachments/1477732500108480755/1477756194549403678/koko2unite_-_6074238.jpg?ex=69a5eb34&is=69a499b4&hm=7f42e9e622fbbe37db0d4ed6e33cedbac43aeadb0c8755a1fc8a18f882424deb&=&format=webp&width=300&height=712',
        'https://media.discordapp.net/attachments/1477732500108480755/1477756194872627280/koutanagamori_venterno_anthroworks_-_6000097.jpg?ex=69a5eb34&is=69a499b4&hm=1a8a99ccfc4b5a6d39d7376f5e71c2fe414e10a2b66a55693fcdc8cb3746801d&=&format=webp&width=897&height=712',
        'https://media.discordapp.net/attachments/1477571857375957064/1478234196953796710/8d979f28d4c1e90ef1a524995a71c636.png?ex=69a7a860&is=69a656e0&hm=fb3ad22a1de74760cef094e4d4c3d5e3b199b20c8ba4b354ba299d68435b17b2&=&format=webp&quality=lossless&width=763&height=726',
        'https://media.discordapp.net/attachments/1477571857375957064/1478239566350778368/9844cc42779ca86142104a5d6d5ebc23.jpg?ex=69a7ad60&is=69a65be0&hm=661dff73bdb24b2f14fed0cde2c05136ed0f7f2f5789855fd03687782171a0e6&=&format=webp&width=608&height=726',
        'https://media.discordapp.net/attachments/1477571857375957064/1478239566015102998/5e4c332de362992f4aeeb99aca47e988.jpg?ex=69a7ad60&is=69a65be0&hm=c3058a626555a926ea186eb82273cb0ffb95cc520726ae4231001c6c527030e0&=&format=webp&width=458&height=725',
        'https://media.discordapp.net/attachments/1477571857375957064/1478240443492864140/2a0ba078beb4e5c638d84a238a9ffd7d.jpg?ex=69a7ae32&is=69a65cb2&hm=440f218a857b345de05453142de79c1d83901552f6b2724ace835f26e63e63c7&=&format=webp',
        'https://media.discordapp.net/attachments/1477571857375957064/1478240443966947338/5d9d7781e83a00364b0fc6c9348d54b8.jpg?ex=69a7ae32&is=69a65cb2&hm=5cf96db559cd4db0cc1de9d9f3acf42e14eee335b2bc547227c6979ce6567ec0&=&format=webp&width=805&height=726',
        'https://media.discordapp.net/attachments/1477571857375957064/1478243789813321778/425e498428dfb079c95fe83266c4567d.jpg?ex=69a7b14f&is=69a65fcf&hm=900d5215fa2a8a065c6e5ddaf28bd832d9a5fbe8ab723cdf6700e32099c91fe1&=&format=webp&width=1046&height=726',
        'https://media.discordapp.net/attachments/1477571857375957064/1478243789175914516/20f81054d02b3e2fd10b79ec8ed0303e.png?ex=69a7b14f&is=69a65fcf&hm=311e377a815256bb0ff22727ef4c91e68e305ddbec6ca2ac31261e231e416580&=&format=webp&quality=lossless&width=532&height=726',
        'https://media.discordapp.net/attachments/1477571857375957064/1478243788664340480/081c76b0a0a0b9127c390c24c4793350.jpg?ex=69a7b14f&is=69a65fcf&hm=28d7d8a7c161e61613df518b9ef5fd868f2d7d6a730bdf9ac7e638d8278fa9e2&=&format=webp&width=545&height=726',
        'https://media.discordapp.net/attachments/1477571857375957064/1478251050853990441/18d854a160c82ee9e48df72d29ad9f5c.jpg?ex=69a7b813&is=69a66693&hm=f29ac17a8d17583d52a691e448d1ff63b5d176e74d62220d55289236569c8d30&=&format=webp&width=826&height=789',
        'https://media.discordapp.net/attachments/1477571857375957064/1478251104008405082/66dec0408bc1276a02168b4b24c5c9a0.jpg?ex=69a7b81f&is=69a6669f&hm=f0f18eb9a6701159f0d1cdcdb24380e4c60d9258d2236cb01ab575234bd8704e&=&format=webp&width=450&height=830',
        'https://media.discordapp.net/attachments/1477571857375957064/1478251136401014855/1bbae9a6607cb7d467dce5fc8ef6a18d.png?ex=69a7b827&is=69a666a7&hm=fe1d124bbef863831b10736309401a23a1924df807b3834a748920d5eed27820&=&format=webp&quality=lossless&width=586&height=726',
        'https://media.discordapp.net/attachments/1477571857375957064/1478243788253036797/0573bcea14dfae8eec7577c42b3defcb.jpg?ex=69a7b14f&is=69a65fcf&hm=a81c312abea1cfebd77590c5e8af85c2ed950591e8ee062c81436b9aba77bae3&=&format=webp&width=990&height=726',
        'https://media.discordapp.net/attachments/1477571857375957064/1478243787712233584/20aea889f3c137f07d9747744ab41ea9.jpg?ex=69a7b14f&is=69a65fcf&hm=713bb76401bc610698c8710905cff9e9258fe19f8e85dbea0c931a6c05ce1ad6&=&format=webp&width=654&height=726'
    ]
};

let sumisoMood = {
    id: 'sumiso',
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
        'https://media.discordapp.net/attachments/1477732500108480755/1477756078858047538/20260301_143858.jpg?ex=69a5eb18&is=69a49998&hm=78fba69fc0de4ea9a60a13823637dc0b80a70b775b46f24fd17d2b56f5997c5d&=&format=webp&width=951&height=712',
        'https://media.discordapp.net/attachments/1477571857375957064/1478215149700776047/968553e7614a1b1ff68557c739c180b3.png?ex=69a796a3&is=69a64523&hm=00b0b2734ffd61529b430bd6b6820c163da72a158bb1ac0f4f7fdd9cd70c6984&=&format=webp&quality=lossless&width=746&height=815',
        'https://media.discordapp.net/attachments/1477571857375957064/1478215205040422922/33dad4c4dca76aa8a0bc0fa6b6af353a.jpg?ex=69a796b0&is=69a64530&hm=d1cddcac95a44322406a7a377fe95ff5098944f0b2c257f05908abc5564c8af6&=&format=webp&width=1006&height=726',
        'https://media.discordapp.net/attachments/1477571857375957064/1478215186946199706/fda37f8d73a7ab24e4fd2536ce0a3ad0.png?ex=69a796ac&is=69a6452c&hm=c9f1c1a8ac8d7cb99cd781aa701a3137effffc7ab17484a96c02c1190890d47c&=&format=webp&quality=lossless&width=1041&height=726',
        'https://media.discordapp.net/attachments/1477571857375957064/1478215254436614296/60d3c91bc1357a6ef89ca6815a889f6b.png?ex=69a796bc&is=69a6453c&hm=8099cff3a60903163a5714aff3b78de38cd53ff712e6f138acf815c49ec4463d&=&format=webp&quality=lossless&width=719&height=726',
        'https://media.discordapp.net/attachments/1477571857375957064/1478215254834942002/0681c2513ee2d9a722c9c63f61d6bd00.png?ex=69a796bc&is=69a6453c&hm=d8646a486da268ce836d6eb0c9cff91aba70339e71c6c6feee57f77d8b4ee8a5&=&format=webp&quality=lossless&width=772&height=726',
        'https://media.discordapp.net/attachments/1477571857375957064/1478215149700776047/968553e7614a1b1ff68557c739c180b3.png?ex=69a796a3&is=69a64523&hm=00b0b2734ffd61529b430bd6b6820c163da72a158bb1ac0f4f7fdd9cd70c6984&=&format=webp&quality=lossless&width=759&height=830',
        'https://media.discordapp.net/attachments/1477571857375957064/1478234196953796710/8d979f28d4c1e90ef1a524995a71c636.png?ex=69a7a860&is=69a656e0&hm=fb3ad22a1de74760cef094e4d4c3d5e3b199b20c8ba4b354ba299d68435b17b2&=&format=webp&quality=lossless&width=763&height=726',
        'https://media.discordapp.net/attachments/1477571857375957064/1478234197515829332/3b4b0ce976861d532f5556b155fe9ee6.png?ex=69a7a860&is=69a656e0&hm=7e0b18128c11c63f4ea33b0ec83de2375f5c36c6f5e21bd4e952b4263ec9c822&=&format=webp&quality=lossless&width=962&height=725',
        'https://media.discordapp.net/attachments/1477571857375957064/1478234198304358482/e3152da26374a0da3684329692213378.png?ex=69a7a861&is=69a656e1&hm=70f03f5f3acf876d0bb15eb6b6968f3116dd438c242e989d00167facd1352606&=&format=webp&quality=lossless&width=671&height=726',
        'https://media.discordapp.net/attachments/1477571857375957064/1478251104008405082/66dec0408bc1276a02168b4b24c5c9a0.jpg?ex=69a7b81f&is=69a6669f&hm=f0f18eb9a6701159f0d1cdcdb24380e4c60d9258d2236cb01ab575234bd8704e&=&format=webp&width=450&height=830',
        'https://media.discordapp.net/attachments/1477571857375957064/1478251137072234526/a89bd7f376136145a69cb3d3365983b3.jpg?ex=69a7b827&is=69a666a7&hm=538487bc546b9046d499236a6e80ee2b1ce230dcf6e2cf2b038fd42c1353a371&=&format=webp&width=408&height=725',
        'https://media.discordapp.net/attachments/1477571857375957064/1478251137642795089/a52014454e17a99cba35be9a04f3b313.jpg?ex=69a7b827&is=69a666a7&hm=dec916f81d59da6f2c42ba9d47009802e56516030e806587743d99030ff3e28d&=&format=webp&width=729&height=726',
        'https://media.discordapp.net/attachments/1477571857375957064/1478251138078867581/b670356fb226214e6336f3d3ad08aacd.jpg?ex=69a7b827&is=69a666a7&hm=a01820cd545a89e32e516161ffde6254c5b43ee3215446d48f3f7e7a86098ea4&=&format=webp&width=530&height=726',
        'https://static1.e621.net/data/sample/38/46/38468b95b31ad4466b6a2652c8462fb4.jpg',
        'https://media.discordapp.net/attachments/1477571857375957064/1479124901750374581/GJqRkyUbAAAPx3B.jpg?ex=69ad88e9&is=69ac3769&hm=d421441fe6daea190bdd1149fdad3e1778daa6e6088e2d2ff6c897c3132d7395&=&format=webp',
        'https://media.discordapp.net/attachments/1477571857375957064/1488739485243019458/GqB_45saAAAFY7R.jpg?ex=69ce88f0&is=69cd3770&hm=48d77ea1d55bb975091b989c90bcd218cb706ec72dbe9d751e0ab0e87cfc51c5&=&format=webp&width=542&height=723'
    ]
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
                    value: mood.id
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
            const selected = availableMoods.find(m => m.id === i.values[0]);
            console.log('Guardando mood para:', author.id);
            console.log('Mood seleccionado:', selected.id);

            const moodPoints = {
                mimoso: 4,
                needy: -4,
                celoso: -5
            };

            if (moodPoints[selected.id] !== undefined) {
                const relationship = await Relationship.findOne({
                    $or: [
                        { user1: author.id },
                        { user2: author.id }
                    ],
                    status: 'accepted'
                });

                if (relationship) {
                    const partnerId = relationship.user1 === author.id
                        ? relationship.user2
                        : relationship.user1;

                    await updateHappiness(author.id, partnerId, moodPoints[selected.id]);
                    await updateStreak(author.id, partnerId);
                }
            }

            await User.findOneAndUpdate(
                { userId: author.id },
                {
                    userId: author.id,
                    currentMood: {
                        name: selected.id,
                        setAt: new Date()
                    }
                },
                { upsert: true, new: true }
            );

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
            console.log('Guardado en DB');

            collector.stop();
        });
    }
};