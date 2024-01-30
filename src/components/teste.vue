<template>
  <v-card flat>
    <v-row>
      <v-col cols="3">
        <v-card class="pa-4" color="blue darken-2" dark>
          <div class="white--text">Módulo Acadêmico</div>
        </v-card>
      </v-col>

      <v-col cols="8">
        <v-card-title class="d-flex align-center pe-2">
          <v-text-field v-model="search" prepend-inner-icon="mdi-magnify" density="compact" label="Search" single-line
            flat hide-details variant="solo-filled"></v-text-field>
          <v-btn @click="openCadastroModal" color="primary">Cadastrar aluno</v-btn>
        </v-card-title>

        <v-divider></v-divider>

        <v-data-table v-model:search="search" :items="items">
          <template v-slot:header="{ computedHeaders }">
            <thead>
              <tr>
                <th v-for="header in computedHeaders" :key="header.value">
                  {{ header.text }}
                </th>
                <th>Ações</th>
              </tr>
            </thead>
          </template>

          <template v-slot:item="{ item }">
            <tr>
              <td v-for="(value, key) in item" :key="key">
                {{ value }}
              </td>
              <td>
                <v-btn @click="openEditModal(item)" icon>
                  <v-icon color="orange darken-2">mdi-pencil</v-icon>
                </v-btn>
                <v-btn @click="openDeleteModal(item)" icon>
                  <v-icon color="red darken-2">mdi-delete</v-icon>
                </v-btn>
              </td>
            </tr>
          </template>
        </v-data-table>

        <!-- Modal para Excluir -->
        <v-dialog v-model="deleteModal" max-width="400">
          <v-card>
            <v-card-title class="headline">Confirmação de Exclusão</v-card-title>
            <v-card-text>
              Deseja mesmo excluir o item?
            </v-card-text>
            <v-card-actions>
              <v-btn color="red darken-2" text @click="deleteItem">Excluir</v-btn>
              <v-btn @click="closeDeleteModal">Cancelar</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <!-- Modal para Cadastrar -->
        <v-dialog v-model="cadastroModal" max-width="600">
          <v-card>
            <v-card-title class="headline">Cadastrar Aluno</v-card-title>
            <v-card-text>
              <!-- Campos de entrada -->
              <v-text-field v-model="novoAluno.name" label="Nome"></v-text-field>
              <v-text-field v-model="novoAluno.email" label="E-mail"></v-text-field>
              <v-text-field v-model="novoAluno.ra" label="RA"></v-text-field>
              <v-text-field v-model="novoAluno.cpf" label="CPF"></v-text-field>
            </v-card-text>
            <v-card-actions>
              <!-- Botões de ação -->
              <v-btn color="red darken-2" text @click="closeCadastroModal">Cancelar</v-btn>
              <v-btn color="green darken-2" @click="saveStudent">Salvar</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <!-- Modal para Editar -->
        <v-dialog v-model="editModal" max-width="600">
          <v-card>
            <v-card-title class="headline">Editar Aluno</v-card-title>
            <v-card-text>
              <!-- Campos de entrada -->
              <v-text-field v-model="alunoSelecionado.name" label="Nome"></v-text-field>
              <v-text-field v-model="alunoSelecionado.email" label="E-mail"></v-text-field>

              <!-- Campos não editáveis -->
              <v-text-field v-model="alunoSelecionado.ra" label="RA" readonly></v-text-field>
              <v-text-field v-model="alunoSelecionado.cpf" label="CPF" readonly></v-text-field>
            </v-card-text>
            <v-card-actions>
              <!-- Botões de ação -->
              <v-btn color="red darken-2" text @click="closeEditModal">Cancelar</v-btn>
              <v-btn color="green darken-2" @click="saveEdit">Salvar</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-col>
    </v-row>
  </v-card>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import axios from 'axios';

const search = ref('');
const items = ref([]);
const deleteModal = ref(false);
const selectedItem = ref(null);

const cadastroModal = ref(false);
const editModal = ref(false);

const novoAluno = ref({
  name: '',
  email: '',
  ra: '',
  cpf: ''
});

const alunoSelecionado = ref({
  name: '',
  email: '',
  ra: '',
  cpf: ''
});

const fetchStudentData = async () => {
  try {
    const response = await axios.get('http://localhost:3000/student/all');
    items.value = response.data;
    console.log("students", items.value);
  } catch (error) {
    console.error("Erro ao buscar dados dos estudantes:", error);
  }
};

const openCadastroModal = () => {
  novoAluno.value = {
    name: '',
    email: '',
    ra: '',
    cpf: ''
  };
  cadastroModal.value = true;
};

const closeCadastroModal = () => {
  cadastroModal.value = false;
};

const saveStudent = async () => {
  try {
    const alunoJson = JSON.stringify(novoAluno.value);

    const response = await axios.post('http://localhost:3000/student', alunoJson, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('Aluno cadastrado com sucesso!');
    fetchStudentData(); // Atualize os dados após o cadastro
    closeCadastroModal();
  } catch (error) {
    console.error("Erro ao cadastrar aluno:", error);
  }
};

const openDeleteModal = (item: any) => {
  selectedItem.value = item;
  deleteModal.value = true;
};

const closeDeleteModal = () => {
  deleteModal.value = false;
};

const deleteItem = async () => {
  if (selectedItem.value) {
    try {
      const { ra } = selectedItem.value;

      // Realize a requisição de exclusão usando o RA na URL
      await axios.delete(`http://localhost:3000/student/${ra}`);

      console.log('Excluindo item com RA:', ra);
      // Atualize os dados após a exclusão
      fetchStudentData();
      // Feche o modal após a exclusão
      closeDeleteModal();
    } catch (error) {
      console.error("Erro ao excluir aluno:", error);
    }
  }
};

const openEditModal = (item: any) => {
  // Clone os dados do aluno para evitar alterações diretamente nos dados da tabela
  alunoSelecionado.value = {
    name: item.name,
    email: item.email,
    ra: item.ra,
    cpf: item.cpf,
  };
  editModal.value = true;
};

const closeEditModal = () => {
  editModal.value = false;
};

const saveEdit = async () => {
  if (alunoSelecionado.value) {
    try {
      const alunoJson = JSON.stringify(alunoSelecionado.value);

      // Realize a requisição de edição usando o RA na URL
      await axios.patch(`http://localhost:3000/student/${alunoSelecionado.value.ra}`, alunoJson, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Editando aluno com RA:', alunoSelecionado.value.ra);
      // Atualize os dados após a edição
      fetchStudentData();
      // Feche o modal após a edição
      closeEditModal();
    } catch (error) {
      console.error("Erro ao editar aluno:", error);
    }
  }
};

fetchStudentData();
</script>
