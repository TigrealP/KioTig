const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const NOVIO_ID = '811091271023722586';
const TU_ID = '765660693835415552';


module.exports = {
    data: new SlashCommandBuilder()
        .setName('fuck')
        .setDescription('¿Alguien se siente caliente? 🐶🐯')
        .addUserOption(option =>
            option
                .setName('usuario')
                .setDescription('Ten cariñito con alguien 🐶🧡🐯')
                .setRequired(true)
        ),

    async execute(interaction){
        const target = interaction.options.getUser('usuario');
        const author = interaction.user;

        let color = '#8b0808';
        let descripcion;
        let titulo;
        let image;

        if (target.id === author.id) {

            if(author.id === TU_ID){
                return interaction.reply({
                    content: 'Estoy seguro que tu cachorrito está a la espera de tus órdenes, amo. 🐯🔥',
                    ephemeral: true
                });
            }

            if(author.id === NOVIO_ID){
                return interaction.reply({
                    content: 'Estoy seguro que tu tigre quiere que seas un buen perrito para él hoy 🐶🔥',
                    ephemeral: true
                });
            }

            return interaction.reply({
                content: 'No puedes hacer eso contigo mismo 🦊',
                ephemeral: true
            });

        }

        if (target.bot) {
            if (author.id === TU_ID) {
                return interaction.reply({
                    content: '¿Tu cachorrito no te complace?, yo soy un bot, ve y ordenale que te complazca 🐯🔥',
                    ephemeral: true
                });
            }
            if (author.id === NOVIO_ID) {
                return interaction.reply({
                    content: '¿Tienes penita de decirle a tu amo que te penetre?, yo soy un bot, ve y complacelo! 🐶🔥',
                    ephemeral: true
                });
            }
            else{
                return interaction.reply({
                    content: 'Los bots no participan es esto... aunque si quieres que tu dueño se ponga celoso, adelante 🦊',
                    ephemeral: true
                });
            }
        }

        if (author.id === TU_ID) {
            color = '#8b0808';
            titulo = `${author.username} se está volviendo loco por su cachorrito🔥`;
            descripcion = `${author.username} Está dominando a su cachorrito en este preciso instante! ${target.username} 🐯🔥`;
            image = ['https://static1.e621.net/data/sample/5b/10/5b10c2de6f589f94b84596df03a5cc3a.jpg',
                    'https://static1.e621.net/data/sample/42/5e/425e498428dfb079c95fe83266c4567d.jpg',
                    'https://static1.e621.net/data/sample/85/bb/85bbf922a20f7302420829d3052499d2.jpg',
                    'https://static1.e621.net/data/sample/96/4b/964b14c98c8be04be843846905901cb9.jpg',
                    'https://static1.e621.net/data/sample/d8/d0/d8d0227f6bee60151c7e492e495399ba.jpg',
                    'https://static1.e621.net/data/sample/e8/20/e8203734e6ece624a7c264c6c0b3e283.jpg',
                    'https://static1.e621.net/data/sample/51/54/5154a2f6388e4579db4d0cbd73d05be4.jpg',
                    'https://static1.e621.net/data/sample/51/94/5194c5121a448944e6b9374a0b4da299.jpg',
                    'https://static1.e621.net/data/sample/1c/af/1caf4f74b8d134151aea3ebd44d5ec85.jpg',
                    'https://static1.e621.net/data/e5/23/e523f89036e5f4b6cb749b385c459641.png',
                    'https://static1.e621.net/data/sample/0e/3d/0e3db8aa2ef7b971acd1f85a991610b4.jpg',
                    'https://static1.e621.net/data/sample/77/f9/77f90014b091b29232ccb9dd08a95d27.jpg',
                    'https://static1.e621.net/data/sample/6c/52/6c527642ca16efe6a2b6d2a70aa5d233.jpg',
                    'https://static1.e621.net/data/sample/f4/fe/f4fe3c49f44d4beef1d8ddc1e5ea0689.jpg',
                    'https://static1.e621.net/data/sample/15/4c/154ccef6209e7bf3691c053ec14eb29e.jpg'
            ];
        }

        else if (author.id === NOVIO_ID) {
            color = '#8b0808';
            titulo = `${author.username} está mojadito y listo para su tigre 🐶🔥`;
            descripcion = `${author.username} Está complaciendo a su tigre en este preciso instante! ${target.username} 🐶🔥`;
            image = ['https://static1.e621.net/data/sample/cb/79/cb790b75c78588d8f7aeca6144820a17.jpg',
                'https://static1.e621.net/data/sample/e5/ce/e5ce7cb42ea0f05712d790405257c237.jpg',
                'https://static1.e621.net/data/sample/38/72/38722b8408c5b88a71416ced25980d49.jpg',
                'https://static1.e621.net/data/sample/92/73/9273b7dd1a7e77dce54600095780efe9.jpg',
                'https://static1.e621.net/data/sample/42/a1/42a1a15f8bc1096fe02072bee7b595cd.jpg',
                'https://static1.e621.net/data/sample/74/52/745285c4a5b00a4c3f027589592f6e6a.jpg',
                'https://static1.e621.net/data/91/8b/918b4203d712bb5aa8286d5d993f70aa.gif',
                'https://static1.e621.net/data/sample/83/bb/83bb3e06b09c6765825594f579da796c.jpg',
                'https://static1.e621.net/data/sample/89/85/8985e0bb86999b1029b825b3244ea412.jpg',
                'https://static1.e621.net/data/sample/0e/05/0e05cde43aba7700fbf4b7709c3c8c18.jpg',
                'https://static1.e621.net/data/sample/b6/aa/b6aa887d406849cae3b9f342ae5c6f43.jpg',
                'https://static1.e621.net/data/sample/e6/2a/e62aeeef05a48bea7ed13e95950d40de.jpg',
                'https://static1.e621.net/data/sample/cb/8e/cb8e91df4f247e324907b16aae90943f.jpg',
                'https://static1.e621.net/data/sample/f5/2c/f52cf0786a0322925a37c68989d6bf5e.jpg'
            ]
        }

        else {
            titulo = `${author.username} anda juguetón 😏`;
            descripcion = `${author.username} está molestando a ${target.username} 🔥`;

            image = [
                'https://static1.e621.net/data/sample/5b/10/5b10c2de6f589f94b84596df03a5cc3a.jpg'
        ];
    }

        const embed = new EmbedBuilder()
            .setColor(color) // rojito pasión
            .setTitle(titulo)
            .setAuthor({
                name: interaction.client.user.username,
                iconURL: interaction.client.user.displayAvatarURL()
            })
            .setThumbnail(target.displayAvatarURL({ dynamic: true }))
            .setImage(image[Math.floor(Math.random() * image.length)])
            .setDescription(descripcion)
            .setFooter({
                text: 'Estoy seguro que tu dueño lo hace por tu bien, perrito. 🐯❤️🐶',
            })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });

    }
};